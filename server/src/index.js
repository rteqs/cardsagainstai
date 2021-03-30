const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const game = require('./game.js')

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

const currentGames = {}

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
    let currentGame = null;
    switch (response.requestType) {
      case 'createGame':
        currentGame = game.initializeGame()
        currentGames[currentGame.gameId] = currentGame
        ws.send(JSON.stringify({"event": "gameCreated", "data": {"game": currentGame}}))
        break;
      case 'addNewPlayer':
        const player = currentGames[response.gameId].addPlayer(ws)
        ws.send(JSON.stringify({'event': "newPlayerAdded", "data": {"player": player}}))
        break;
      case 'pickCzar':
        currentGame = currentGames[response.gameId]
        currentGame.pickCzar()
        // Loop through each player and send an appropriate event to each saying whether they were chosen to be czar or not
        currentGame.players.forEach(player => {
          const data = {'event': 'czarPicked', 'data': {'chosen': false}}
          if (player.playerId === currentGame.czar.playerId) {
            data.data.chosen = true
          }
          player.ws.send(JSON.stringify(data))
        });
        break;
      case 'join':
        // game.handleJoin(ws)
        break;

      case 'leave':
        break;

      case 'play':
        break;
      default:
        console.log('Invalid method', response.method);
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
