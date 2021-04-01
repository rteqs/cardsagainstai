const { v4: uuidv4 } = require('uuid');

const playerUtil = require("./player");

function Game() {
  this.gameId = uuidv4(); // uuid
  this.state = 0; // PLAYING 1, JUDGING 2, IDLE 0
  this.czar = null; // Player object
  this.players = []; // Player | Array
  this.board = {
    // gathered black cards,totalRounds = 41 (for numPlayers = 10, targetPoints = 5)
    questionCards: [], // number (cardId) | Array
    // gathered white cards, num_players * totalRounds = 469 total
    answerCards: [], // number (cardId) | Array
    // currentAnswerCards: [], // number (cardId) | Array
		currentAnswerCardsMap: {}, // object {cardId: playerId} 
		currentQuestionCard: null, // card object
    turnNum: 0,
  };
  this.timestamp = new Date();
	// this.gameId = '';
  // this.wss = wss // maybe need? maybe not?
}

/**
 * Game loop
 * @params ws
 */
Game.prototype.start = function (ws, redis) {
  const fullHandSize = 10
  const numPlayers = this.players.length
  const targetPoints = 5
  const totalRounds = numPlayers * (targetPoints - 1) + targetPoints
	// 1. Load cards from DB
  this.board.questionCards = redis.getQuestionCards(totalRounds, true)
  const numWhiteCards = numPlayers * totalRounds
  this.board.answerCards = redis.getAnswerCards(numWhiteCards, true)
  // 2. Deal cards (including black)
  this.currentQuestionCard = this.board.questionCards.pop()
  this.players = this.replenishHand(this.players, fullHandSize)

	// 5. wait for all player to play a card (except Czar): handleSelect
	// 6. updateBoard // show all played white Cards
	// 7. Turn to state to judging
	// 8. Wait for Czar: handlePickWinningCard
	// 9. Clean Board // removes all black and  white cards
	// 10. updatePlayerList 
	// 11. loop Back 
};

/**
 * Adds player to the game room
 * @params ws WebSocket
 */
Game.prototype.addPlayer = function (ws) {
  const player = playerUtil.createPlayer(ws)
  this.players.push(player)
  return player;
};

/**
 * Picks a czar for the current round
 * @returns
 */
Game.prototype.pickCzar = function () {
  const czar = this.players[Math.floor(Math.random() * this.players.length)];
  this.czar = czar;
};


/**
 * Deals cards to players until they have fullHandSize cards
 * @param fullHandSize Number of cards to replenish to
 * @returns List of players
 */
Game.prototype.replenishHand = function (players, fullHandSize) {
  players.forEach(player => {
    while (player.hand.length < fullHandSize) {
      player.hand.push(this.board.answerCards.pop())
    }
  });
  return players
}

/**
 * Handles player card selction
 * @returns boolean
 */
Game.prototype.handleSelect= function (players) {}

/**
 * Handles czar card selection && increment player score
 * @returns boolean 
 */
Game.prototype.handlePickWinningCard = function (players) {}

/**
 * Add new player and update other players
 * @returns boolean
 */ 
Game.prototype.handleJoin = function (ws) {

}

/**
 * Sends the current state board to the player
 */
Game.prototype.updateBoard = function (ws) {
	// const {questionCards, answerCards, ...data} =  this.board
	// ws.send(data)
}

/**
 * Sends the playerList to all players
 */
Game.prototype.updatePlayerList= function (ws) {}

/**
 * Removes currentQuestionCard & currentAnswerCards
 */
Game.prototype.cleanBoard =function () {}

/**
 * shuffles the deck of cards
 */
Game.prototype.shuffle = function () {}

/**
 * Check if all players (except czar) have played a card
 * 	@returns boolean
 */
Game.prototype.checkAllPlayers = function () {

} 

/**
 * Factory method for Game
 * @returns Game object
 */
function initializeGame() {
  const game = new Game();
  return game;
}

module.exports = {
  initializeGame
};
