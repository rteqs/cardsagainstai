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

function broadCastGameUpdated(gameId) {
  const currentGame = redisUtil.getGame(gameId);
  const data = { event: 'gameUpdated', data: { game: currentGame } };
  // let wsList = []
  for (playerId of Object.keys(currentGame.players)) {
    const player = currentGame.players[playerId];
    console.log(`Sending game updated to player ${player.playerId}`);
    try {
      player.ws.send(JSON.stringify(data));
    } catch (error) {
      console.log(`Error: ${error}`);
      // error should handle when there is circular data structure, don't need to update the current player anyways
    }
  }
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
  let currentGame;
  let gameList;
  ws.on('message', (event) => {
    const response = JSON.parse(event);
    console.log('Message from server ', response);
    switch (response.requestType) {
      case 'createGame':
        // validation
        currentGame = game.initializeGame();
        currentGame.handleJoin(ws, true);
        redisUtil.addGame(currentGame);
        break;

      case 'joinGame':
        // validation
        currentGame = redisUtil.getGame(response.gameId);
        currentGame.handleJoin(ws, false);
        redisUtil.updateGame(currentGame);
        break;

      case 'startGame':
        try {
          currentGame = redisUtil.getGame(response.gameId);
          currentGame.start(redisUtil);
          // console.log("Current game: " + JSON.stringify(currentGame, undefined, 2))
          ws.send(
            JSON.stringify({
              event: 'gameStarted',
              status: '200',
              message: '',
            })
          );
          redisUtil.updateGame(currentGame);
        } catch (error) {
          console.log(error);
          ws.send({ error: error.message });
        }

        break;

      case 'playCard':
        try {
          currentGame = redisUtil.getGame(response.gameId);
          currentGame.handleSelect(response.playerId, response.cardId);
          ws.send(
            JSON.stringify({
              event: 'playCard',
              status: '200',
            })
          );
          redisUtil.updateGame(currentGame);
        } catch (error) {
          console.log(error);
          ws.send({ error: error.message });
        }
        break;

      case 'pickCard':
        try {
          currentGame = redisUtil.getGame(response.gameId);
          currentGame.handlePickWinningCard(response.playerId, response.cardId);
          ws.send(
            JSON.stringify({
              event: 'pickCard',
              status: '200',
            })
          );
          redisUtil.updateGame(currentGame);
        } catch (error) {
          console.log(error);
          ws.send({ error: error.message });
        }
        break;

      case 'leave':
        currentGame = redisUtil.getGame(response.gameId);
        currentGame.handleLeave(ws, response.playerId);

        redisUtil.updateGame(currentGame);
        break;

      case 'getGameList':
        gameList = Object.values(redisUtil.getAllGames()).map(([gid, obj]) => ({
          gid,
          name: obj.name,
          goal: obj.goal,
          maxPlayers: obj.maxPlayers,
          numberOfPlayer: obj.players.size,
        }));
        ws.send(
          JSON.stringify({
            event: 'getGameList',
            status: '200',
            gameList,
          })
        );
        break;

      default:
        console.log('Invalid method', response.method);
    }
    if (currentGame !== null) {
      broadCastGameUpdated(currentGame.gameId);
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
