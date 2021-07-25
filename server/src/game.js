const { v4: uuidv4 } = require('uuid');

const { createPlayer } = require('./Player');

// Variables for testing easily
testing = true
enable_player_limit = !testing

function Game(goal, name, maxPlayers) {
  this.gameId = uuidv4();
  this.name = name;
  this.goal = goal;
  this.maxPlayers = maxPlayers;
  this.state = 0; // PLAYING 1, JUDGING 2, IDLE 0
  this.czar = null; // Player object
  this.players = new Map(); // playerId: Player Need order of insertion
  // gathered black cards,totalRounds = 41 (for numPlayers = 10, targetPoints = 5)
  this.questionCards = []; // number (cardId) | Array
  // gathered white cards, num_players * totalRounds = 469 total
  this.answerCards = []; // number (cardId) | Array
  this.board = {
    currentAnswerCards: [], // number (cardId) | Array
    currentAnswerCardsMap: {}, // object {cardId: playerId}
    currentQuestionCard: null, // card object
    turnNum: 0,
  };
  this.timestamp = new Date();
  // 1. Load appropriate number of cards from DB
  // 2. Deal cards to board and players
  // 3. Pick Czar
  // 5. wait for all player to play a card (except Czar): handleSelect
  // 6. updateBoard // show all played white Cards
  // 7. Turn to state to judging
  // 8. Wait for Czar: handlePickWinningCard
  // 9. Clean Board // removes all black and  white cards
  // 10. updatePlayerList
  // 11. loop Back
}

/**
 * Factory method for Game
 * @returns Game object
 */
function initializeGame(goal, name, maxPlayers) {
  const game = new Game(goal, name, maxPlayers);
  return game;
}

/**
 * Start an idle game
 */
Game.prototype.handleStart = function (playerId, redis) {
  if (this.state !== 0) {
    throw new Error('Game in progress.');
  }

  if (!this.players.get(playerId).host) {
    throw new Error("Not host. Can't start game");
  }

  if (this.players.size <= 2 && enable_player_limit) {
    throw new Error("Not enough players. Can't start game");
  }

  const fullHandSize = 10;
  const numPlayers = this.players.size;
  const totalRounds = numPlayers * (this.goal - 1) + this.goal;
  // Average card draw = 1.14 = (470 + 67*2 + 4*3) / 541
  // Conservative estimate, 1.3
  const numWhiteCards = Math.ceil(numPlayers * (10 + 1.3 * totalRounds));
  this.questionCards = redis.getQuestionCards(totalRounds, true);
  this.answerCards = redis.getAnswerCards(numWhiteCards, true);
  shuffle(this.questionCards);
  shuffle(this.answerCards);
  this.board.currentQuestionCard = this.questionCards.pop();
  this.replenishHand(fullHandSize, redis);
  this.pickCzar();
  this.state = 1;
  Array.from(this.players.values()).forEach((p) => {
    // console.log(`player: ${p.playerId}`);
    this.updatePlayer(p.ws, p.playerId);
  });
  this.updateBoard();
  this.updatePlayerList();

  const data = {
    event: 'gameStarted',
    status: '200',
    questionCards: redis.getCardDataFor(this.questionCards, true),
    answerCards: redis.getCardDataFor(this.answerCards, false),
  };
  broadcast(Array.from(this.players.values()), data);
};

/**
 * Add new player and update other players
 * @returns boolean
 */
Game.prototype.handleJoin = function (ws, host) {
  let player = createPlayer(ws);
  player.host = host;
  this.players.set(player.playerId, player);
  player = omit(player, 'ws');

  ws.send(
    JSON.stringify({
      event: 'joinGame',
      status: '200',
      player,
      game: {
        gameId: this.gameId,
        name: this.name,
        goal: this.goal,
        czar: this.czar,
        maxPlayers: this.maxPlayers,
        state: this.state,
        board: this.board,
        playerList: this.playersToList(),
      },
    })
  );
  this.updatePlayerList();
};

/**
 * Removes player and update other players
 * @returns boolean
 */
Game.prototype.handleLeave = function (ws, playerId) {
  const player = this.players.get(playerId);
  if (!player) {
    throw new Error('not in game');
  }
  const { status } = player;
  this.players.delete(playerId);
  this.updatePlayerList();
  ws.send(
    JSON.stringify({
      event: 'leave',
      status: '200',
    })
  );

  if (status === 1) {
    const [cid, pid] = Object.entries(this.currentAnswerCardsMap).find((arr) =>
      arr.includes(playerId)
    );
    this.currentAnswerCardsMap.delete(cid);
    this.updateBoard();
  } else if (status === 2) {
    console.log('Czar leaving');
    ws.send({
      event: 'broadcast message',
      message: 'Czar left the game. Refunding cards.',
    });
    this.cleanBoard();
    this.updateBoard();
  }
};

/**
 * Handles player card selction
 */
Game.prototype.handleSelect = function (playerId, cardId) {
  if (!this.players.has(playerId)) {
    throw Error(`playerId ${playerId} is not valid or not part of this game`);
  }
  const player = this.players.get(playerId);
  if (player.status === 0 && player.hand.includes(cardId)) {
    // Card not selected
    this.board.currentAnswerCardsMap[cardId] = playerId;
    const cardIndex = player.hand.indexOf(cardId);
    player.hand.splice(cardIndex, 1);
    console.log(`Selected card ${cardId} with index ${cardIndex}`);
    player.status = 1;
    // Begin judging phase if all players have played a card
    if (this.checkAllPlayers()) {
      this.state = 2;
      Array.from(this.players.values()).forEach((p) => {
        if (p.playerId !== playerId) {
          this.updatePlayer(p.ws, p.playerId);
        }
      });
    }
    this.updateBoard();
    this.updatePlayer(player.ws, player.playerId);
    this.updatePlayerList();
  } else {
    // Already submitted or czar
    throw new Error('Invalid Operation');
  }
};

/**
 * Handles czar card selection && increment player score
 * @returns boolean
 */
Game.prototype.handlePickWinningCard = function (playerId, cardId) {
  const player = this.players.get(playerId);
  if (
    this.state === 2 &&
    player.status === 2 &&
    this.board.currentAnswerCards.includes(cardId)
  ) {
    const winner = this.currentAnswerCardsMap[cardId];
    winner.score += 1;
    const event = winner.score === this.goal ? 'gameOver' : 'win';
    const data = {
      event,
      player: winner.id,
      card: cardId,
    };

    Array.from(this.players.values()).forEach((p) => {
      p.ws.send(JSON.stringify(data));
    });

    const twentySeconds = 20 * 1000;
    if (event === 'win') {
      this.handleNextTurn();
    } else {
      this.handleGameOver();
    }
    setTimeout(() => {
      Array.from(this.players.values()).forEach((p) => {
        this.updatePlayer(p.ws, p.playerId);
      });
      this.updateBoard();
    }, twentySeconds);
  } else {
    // Not czar or card is not in play
    throw new Error('Invalid Operation');
  }
};

Game.prototype.handleNextTurn = function () {
  this.cleanBoard();
  this.replenishHand();
  this.pickCzar();
  this.board.currentQuestionCard = this.questionCards.pop();
  this.updatePlayerList();
};

Game.prototype.handleGameOver = function () {
  this.state = 0;
  this.cleanBoard();
  this.board.turnNum = 0;
  this.questionCards = [];
  this.answerCards = [];
};

/**
 * Sends the current state board to all players
 */
Game.prototype.updateBoard = function () {
  const data = {
    event: 'updateBoard',
    board: this.board,
  };
  Array.from(this.players.values()).forEach((player) => {
    player.ws.send(JSON.stringify(data));
  });
};

/**
 * Update player on information about the game
 * relevant to them (individual)
 */
Game.prototype.updatePlayer = function (ws, id) {
  if (!this.players.get(id)) {
    throw new Error('Not in game');
  }

  const player = omit(this.players.get(id), 'ws');
  console.log("###Player before ws.send:", player)
  const data = {
    event: 'updatePlayer',
    state: this.state,
    czar: this.czar,
    player,
  };
  ws.send(JSON.stringify(data));
};

/**
 * Sends the playerList to all players (Shared data)
 */
Game.prototype.updatePlayerList = function () {
  const playerList = Array.from(this.players.values());
  const filteredPlayerList = playerList.map((player) =>
    omit(player, 'hand', 'ws')
  );
  const data = {
    event: 'updatePlayerList',
    filteredPlayerList,
  };
  broadcast(playerList, data);
};

/**
 * Picks a czar for the current round
 * @returns
 */
Game.prototype.pickCzar = function () {
  const index = this.board.turnNum % this.players.size;
  const player = Array.from(this.players.values())[index];
  player.status = 2;
  this.czar = player.id;
};

/**
 * Deals cards to players until they have fullHandSize cards
 * @param fullHandSize Number of cards to replenish to
 */
Game.prototype.replenishHand = function (fullHandSize, redis) {
  Array.from(this.players.values()).forEach((player) => {
    while (Object.keys(player.hand).length < fullHandSize) {
      cardId = this.answerCards.pop()
      cardTextObj = redis.getCardDataFor([cardId])
      console.log('Added card ', cardId, 'to player', player.playerId)
      player.hand[cardId] = cardTextObj[cardId]['text'];
    }
  });
};

/**
 * Adds player to the game room
 */
Game.prototype.addPlayer = function () {
  const player = createPlayer();
  this.players.set(player.playerId, player);
  return player;
};

/**
 * Check if all players (except czar) have played a card
 * 	@returns boolean
 */
Game.prototype.checkAllPlayers = function () {
  for (const player of this.players.values()) {
    if (player.status === 0) {
      return false;
    }
  }
  return true;
};

/**
 * Give back the cards that players have played during the turn
 */
Game.prototype.refundCards = function () {
  const { players } = this;
  Object.entries(this.currentAnswerCardsMap).forEach((cardId, playerId) => {
    players.get(playerId).hand.push(cardId);
  });
};

/**
 * Removes currentQuestionCard & currentAnswerCards
 */
Game.prototype.cleanBoard = function () {
  Array.from(this.players.values()).forEach((player) => {
    player.status = 0;
  });
  this.czar = null;
  this.baord.turnNum += 1;
  this.board.currentQuestionCards = [];
  this.board.currentAnswerCards = [];
  this.board.currentAnswerCardsMap = {};
  this.state = 1;
};

Game.prototype.playersToList = function () {
  return Array.from(this.players.values()).map((p) => omit(p, 'ws', 'hand'));
};

/**
 * Broadcast data to all players
 */
function broadcast(playerList, data) {
  playerList.forEach((player) => player.ws.send(JSON.stringify(data)));
}

/**
 * shuffles the deck of cards
 */
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => {
    delete result[prop];
  });
  return result;
}

module.exports = {
  initializeGame,
};
