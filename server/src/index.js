const http = require('http');
const WebSocket = require('ws');
const Joi = require('joi');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const game = require('./game.js');
const redisUtil = require('./utils/redis.js');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// const gameObjects = {} (redis)

function connectClient(ws) {
  const payload = {
    event: 'connected',
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
    const request = JSON.parse(event);
    console.log('Message from server ', request);
    if (requestValid(ws, request)) {
      handleRequest(ws, request);
    }
  });
});

function requestValid(ws, request) {
  if (!request.requestType) {
    ws.send(JSON.stringify({ error: 'requestType missing' }));
    return false;
  }

  let schema = null;
  switch (request.requestType) {
    case 'createGame':
      schema = Joi.object()
        .keys({
          info: Joi.object()
            .keys({
              goal: Joi.string().required(),
              name: Joi.string().required(),
            })
            .required(),
        })
        .unknown();
      break;

    case 'joinGame':
      schema = Joi.object()
        .keys({
          gameId: Joi.string().required(),
        })
        .unknown();
      break;

    case 'startGame':
    case 'leave':
      schema = Joi.object()
        .keys({
          gameId: Joi.string().required(),
          playerId: Joi.string().required(),
        })
        .unknown();
      break;

    case 'playCard':
    case 'pickCard':
      schema = Joi.object()
        .keys({
          gameId: Joi.string().required(),
          playerId: Joi.string().required(),
          cardId: Joi.string().required(),
        })
        .unknown();
      break;

    case 'getGameList':
      schema = Joi.object().keys({}).unknown();
      break;

    default:
      ws.send(
        JSON.stringify({
          error: `Unknown requestType "${request.requestType}"`,
        })
      );
      return false;
  }

  const errorMessage = schema.validate(request, { stripUnknown: true }).error;

  if (errorMessage) {
    ws.send(JSON.stringify({ error: errorMessage }));
    return false;
  }
  return true;
}

// Backend client code
function handleRequest(ws, request) {
  let currentGame;
  let gameList;
  switch (request.requestType) {
    case 'createGame':
      currentGame = game.initializeGame(
        parseInt(request.info.goal),
        request.info.name
      );
      currentGame.handleJoin(ws, true);
      redisUtil.addGame(currentGame);
      break;

    case 'joinGame':
      try {
        currentGame = redisUtil.getGame(request.gameId);
      } catch (error) {
        ws.send(JSON.stringify({ error: error.message }));
        break;
      }
      currentGame.handleJoin(ws, false);
      redisUtil.updateGame(currentGame);
      break;

    case 'startGame':
      try {
        currentGame = redisUtil.getGame(request.gameId);
        currentGame.handleStart(request.playerId, redisUtil);
        redisUtil.updateGame(currentGame);
      } catch (error) {
        console.log(error);
        ws.send(JSON.stringify({ error: error.message }));
      }
      break;

    case 'playCard':
      try {
        currentGame = redisUtil.getGame(request.gameId);
        currentGame.handleSelect(request.playerId, request.cardId);
        ws.send(
          JSON.stringify({
            event: 'playCard',
            status: '200',
          })
        );
        redisUtil.updateGame(currentGame);
      } catch (error) {
        console.log(error);
        ws.send(JSON.stringify({ error: error.message }));
      }
      break;

    case 'pickCard':
      try {
        currentGame = redisUtil.getGame(request.gameId);
        currentGame.handlePickWinningCard(request.playerId, request.cardId);
        ws.send(
          JSON.stringify({
            event: 'pickCard',
            status: '200',
          })
        );
        redisUtil.updateGame(currentGame);
      } catch (error) {
        console.log(error);
        ws.send(JSON.stringify({ error: error.message }));
      }
      break;

    case 'leave':
      currentGame = redisUtil.getGame(request.gameId);
      currentGame.handleLeave(ws, request.playerId);

      redisUtil.updateGame(currentGame);
      break;

    case 'getGameList':
      console.log('games in redis', redisUtil.getAllGames());
      gameList = Object.entries(redisUtil.getAllGames()).map(([gid, obj]) => ({
        gameId: gid,
        name: obj.name,
        goal: obj.goal,
        maxPlayers: obj.maxPlayers,
        numberOfPlayer: obj.players.size,
        players: obj.playersToList(),
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
      console.log('Invalid method', request.requestType);
  }
}

// Ping clients every 10 seconds
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    // console.log('ping');
    ws.isAlive = false;
    ws.ping();
  });
}, 10000);

// const port = process.env.PORT || 8080;
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
