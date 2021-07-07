// FRONTEND-CLIENT: This is pretty much the Frontend-Client which sends requests through websocket to the backend

function getActiveGames(ws) {
  const req = {
    type: 'message',
    requestType: 'getGameList',
    date: Date.now(),
  };

  ws.send(JSON.stringify(req));
}

function joinGame(ws, gameId) {
  const data = {
    requestType: 'joinGame',
    gameId,
    date: Date.now(),
  };
  ws.send(JSON.stringify(data));
}

function createGame(ws, name, goal, numAI) {
  const data = {
    requestType: 'createGame',
    info: {
      name,
      goal,
      numAI,
    },
    date: Date.now(),
  };
  ws.send(JSON.stringify(data));
  return '183028100';
}

function startGame(ws, playerId, gameId) {
  console.log('Starting game');
  const data = { requestType: 'startGame', playerId, gameId };
  ws.send(JSON.stringify(data));
}

function getGameInfo() {
  return {
    blackCard: { text: 'niceoo' },
    whiteCards: [
      { text: 'ok buddy' },
      { text: 'ok buddy' },
      { text: 'ok buddy' },
      { text: 'ok buddy' },
      { text: 'ok buddy' },
      { text: 'ok buddy' },
      { text: 'ok buddy' },
      { text: 'ok buddy' },
      { text: 'ok buddy' },
      { text: 'trash' },
    ],
    players: [
      { name: 'yousef', userID: 'yousef', score: 1, isCzar: false },
      { name: 'mot', userID: 'mot', score: 2, isCzar: false },
    ],
    allPicked: true,
    goal: 8,
  };
}

function playCard(ws, cardId, gameId, playerId) {
  console.log(cardId);
  const data = {
    requestType: 'playCard',
    cardId,
    gameId,
    playerId,
  };
  ws.send(JSON.stringify(data));
}

function pickCard(ws, cardId, gameId, playerId) {
  console.log(cardId);
  const data = {
    requestType: 'pickCard',
    cardId,
    gameId,
    playerId,
  };
  ws.send(JSON.stringify(data));
}

function waitForOpenConnection(socket) {
  return new Promise((resolve, reject) => {
    const maxNumberOfAttempts = 10;
    const intervalTime = 200; // ms

    let currentAttempt = 0;
    const interval = setInterval(() => {
      if (currentAttempt > maxNumberOfAttempts - 1) {
        clearInterval(interval);
        reject(new Error('Maximum number of attempts exceeded'));
      } else if (socket.readyState === socket.OPEN) {
        clearInterval(interval);
        resolve();
      }
      currentAttempt += 1;
    }, intervalTime);
  });
}

async function connectToServer() {
  const ws = new WebSocket('ws://localhost:8080');
  await waitForOpenConnection(ws);
  return ws;
}

export default {
  getActiveGames,
  createGame,
  getGameInfo,
  playCard,
  pickCard,
  connectToServer,
  joinGame,
  startGame,
};
