const http = require('http');
const Joi = require('joi');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const game = require('./game.js');
const redisUtil = require('./utils/redis.js');

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// const gameObjects = {} (redis)

function connectClient(socket) {
  socket.emit('connected');
}

io.on('connection', (socket) => {
  console.log('client connected');
  connectClient(socket);
  // Closing connection
  socket.on('disconnect', () => console.log('Closed connection with client'));
  socket.on('message', (event) => {
    const request = JSON.parse(event);
    console.log('Message from server ', request);
    if (requestValid(socket, request)) {
      handleRequest(socket, request);
    }
  });
});

function requestValid(socket, request) {
  if (!request.requestType) {
    socket.emit('error', { error: 'requestType missing' });
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
      socket.emit('error', {
        error: `Unknown requestType "${request.requestType}"`,
      });
      return false;
  }

  const errorMessage = schema.validate(request, { stripUnknown: true }).error;

  if (errorMessage) {
    socket.emit('error', { error: errorMessage });
    return false;
  }
  return true;
}

function handleRequest(socket, request) {
  let currentGame;
  let gameList;
  switch (request.requestType) {
    case 'createGame':
      currentGame = game.initializeGame(
        parseInt(request.info.goal),
        request.info.name
      );
      currentGame.handleJoin(socket, true);
      redisUtil.addGame(currentGame);
      break;

    case 'joinGame':
      try {
        currentGame = redisUtil.getGame(request.gameId);
      } catch (error) {
        socket.emit(JSON.stringify({ error: error.message }));
        break;
      }
      currentGame.handleJoin(socket, false);
      redisUtil.updateGame(currentGame);
      break;

    case 'startGame':
      try {
        currentGame = redisUtil.getGame(request.gameId);
        currentGame.handleStart(request.playerId, redisUtil);
        redisUtil.updateGame(currentGame);
      } catch (error) {
        console.log(error);
        socket.emit(JSON.stringify({ error: error.message }));
      }
      break;

    case 'playCard':
      try {
        currentGame = redisUtil.getGame(request.gameId);
        currentGame.handleSelect(request.playerId, request.cardId);
        socket.emit(
          JSON.stringify({
            event: 'playCard',
            status: '200',
          })
        );
        redisUtil.updateGame(currentGame);
      } catch (error) {
        console.log(error);
        socket.emit(JSON.stringify({ error: error.message }));
      }
      break;

    case 'pickCard':
      try {
        currentGame = redisUtil.getGame(request.gameId);
        currentGame.handlePickWinningCard(request.playerId, request.cardId);
        socket.emit(
          JSON.stringify({
            event: 'pickCard',
            status: '200',
          })
        );
        redisUtil.updateGame(currentGame);
      } catch (error) {
        console.log(error);
        socket.emit(JSON.stringify({ error: error.message }));
      }
      break;

    case 'leave':
      currentGame = redisUtil.getGame(request.gameId);
      currentGame.handleLeave(socket, request.playerId);

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
      socket.emit('getGameList', {
        status: '200',
        gameList,
      });
      break;

    default:
      console.log('Invalid method', request.requestType);
  }
}

// Ping clients every 10 seconds (Socket.io does this for us)
// setInterval(() => {
//   wss.clients.forEach((ws) => {
//     if (!ws.isAlive) return ws.terminate();
//     // console.log('ping');
//     ws.isAlive = false;
//     ws.ping(null, false, true);
//   });
// }, 10000);

// const port = process.env.PORT || 8080;
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
