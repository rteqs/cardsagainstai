const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const game = require('./game.js')
const redisUtil = require('./utils/redis.js')

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
  let currentGame = redisUtil.getGame(gameId)
  let data = {'event': 'gameUpdated', 'data': {'game': currentGame}}
  // let wsList = []
  for (playerId of Object.keys(currentGame.players)) {
    let player = currentGame.players[playerId]
    console.log("Sending game updated to player " + player.playerId)
    try {
      player.ws.send(JSON.stringify(data))      
    } catch (error) {
      console.log("Error: " + error)
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
  ws.on('message', (event) => {
    const response = JSON.parse(event)
    console.log('Message from server ', response);
    let currentGame = playerId = null;
    switch (response.requestType) {
      case 'createGame':
        currentGame = game.initializeGame()
        playerId = currentGame.addPlayer(ws)
        redisUtil.addGame(currentGame)
        ws.send(JSON.stringify({"event": "gameCreated", "data": {"game": currentGame}}))
        break;
      case 'joinGame':
        currentGame = redisUtil.getGame(response.gameId)
        playerId = currentGame.addPlayer(ws)
        redisUtil.updateGame(currentGame)
        ws.send(JSON.stringify({'event': "joinedGame", "data": {"game": currentGame, "playerId": playerId}}))
        break;
      case 'startGame':
        currentGame = redisUtil.getGame(response.gameId)
        currentGame.start(ws, redisUtil)
        redisUtil.updateGame(currentGame)
        // console.log("Current game: " + JSON.stringify(currentGame, undefined, 2))
        ws.send(JSON.stringify({'event': "gameStarted", "data": {"game": currentGame}}))
        break;
      case 'getGameObj': // TODO: Remove. only testing
        ws.send(JSON.stringify({'event': 'retrievedGameObj', 'data': {'game': redisUtil.getGame(response.gameId)}}))
        break;
      case 'selectCard':
        currentGame = redisUtil.getGame(response.gameId)
        currentGame.handleSelect(response.playerId, response.cardId)
        redisUtil.updateGame(currentGame)
        ws.send(JSON.stringify({'event': 'cardSelected', 'data': {'game': currentGame}}));
        break;
      // TODO: add getGameList for displaying in lobby
      case 'leave':
        break;

      case 'play':
        break;
      default:
        console.log('Invalid method', response.method);
    }
    if (currentGame !== null) {
      broadCastGameUpdated(currentGame.gameId, )
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
