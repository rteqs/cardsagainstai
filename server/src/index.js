const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const game = require('./game.js');
const redisUtil = require('./utils/redis.js');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// const gameObjects = {} (redis)
function connectClient(ws) {
  const id = uuidv4();
  const payload = {
    event: 'connected',
    id,
  };
  ws.send(JSON.stringify(payload));
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  console.log('client connected');
  connectClient(ws);
  // Closing connection
  ws.on('close', () => console.log('Closed connection with client'));
  // Checking if connection is alive
  ws.on('pong', () => {
    // console.log('pong');
    ws.isAlive = true;
  });
  // Receiving message from client
  ws.on('message', (event) => {
    const response = JSON.parse(event);
    console.log('Message from server ', response);
    let currentGame = (player = null);
    switch (response.requestType) {
      case 'createGame':
        currentGame = game.initializeGame();
        redisUtil.addGame(currentGame);
        ws.send(
          JSON.stringify({ event: 'gameCreated', data: { game: currentGame } })
        );
        break;
      case 'joinGame':
        currentGame = redisUtil.getGame(response.gameId);
        player = currentGame.addPlayer(ws);
        redisUtil.updateGame(currentGame);
        ws.send(JSON.stringify({ event: 'joinedGame', data: { player } }));
        break;
      case 'addNewPlayer':
        currentGame = redisUtil.getGame(response.gameId);
        player = currentGame.addPlayer(ws);
        redisUtil.updateGame(currentGame);
        ws.send(JSON.stringify({ event: 'newPlayerAdded', data: { player } }));
        break;
      case 'startGame':
        currentGame = redisUtil.getGame(response.gameId);
        currentGame.start(ws, redisUtil);
        redisUtil.updateGame(currentGame);
        // console.log("Current game: " + JSON.stringify(currentGame, undefined, 2))
        ws.send(
          JSON.stringify({ event: 'gameStarted', data: { game: currentGame } })
        );
        break;
      case 'pickCzar': // TODO: remove because this is game logic add as part of startGame
        currentGame = redisUtil.getGame(response.gameId);
        currentGame.pickCzar();
        // Loop through each player and send an appropriate event to each saying whether they were chosen to be czar or not
        currentGame.players.forEach((player) => {
          const data = { event: 'czarPicked', data: { chosen: false } };
          if (player.playerId === currentGame.czar.playerId) {
            data.data.chosen = true;
          }
          player.ws.send(JSON.stringify(data));
        });
        redisUtil.updateGame(currentGame);
        break;
      case 'getGameObj': // TODO: Remove only testing
        ws.send(
          JSON.stringify({
            event: 'retrievedGameObj',
            data: { game: redisUtil.getGame(response.gameId) },
          })
        );
        break;
      case 'selectCard':
        currentGame = redisUtil.getGame(response.gameId);
        player = currentGame.players[response.playerId];
        if (player.status === 0) {
          // Card not selected
          currentGame.board.currentAnswerCardsMap[player.playerId] =
            response.cardId;
          player.hand.splice(player.hand.indexOf(cardId), 1);
          currentGame.players[response.playerId] = player;
          redisUtil.updateGame(currentGame);
          ws.send(
            JSON.stringify({
              event: 'cardSelected',
              data: { game: currentGame },
            })
          );
        } else {
          // Already submitted or czar
          // TODO: How to send errors?
        }
        break;
      // TODO: add getGameList for displaying in lobby
      case 'leave':
        break;

      case 'play':
        break;
      default:
        console.log('Invalid method', response.requestType);
    }
  });
});

// Ping clients every 10 seconds
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    // console.log('ping');
    ws.isAlive = false;
    ws.ping(null, false, true);
  });
}, 10000);

// const port = process.env.PORT || 8080;
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
