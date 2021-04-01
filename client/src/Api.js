import history from './history';

function getActiveGames(ws) {
  if (!ws) {
    console.log('No websocket socket connection');
  }

  const req = {
    type: 'message',
    requestType: 'getGameList',
    date: Date.now(),
  };

  const response = ws.send(JSON.stringify(req));
  console.log(response);

  return [
    {
      gameId: '12131321',
      name: 'game 1',
      players: [
        { name: 'tom', userId: '12131321' },
        { name: 'mot', userId: '0900' },
      ],
      goal: 8,
    },
    {
      gameId: '12131321',
      name: 'game 1',
      players: [
        { name: 'tom', userId: '12131321' },
        { name: 'mot', userId: '0900' },
      ],
      goal: 8,
    },
    {
      gameId: '12131321',
      name: 'game 1',
      players: [
        { name: 'tom', userId: '12131321' },
        { name: 'mot', userId: '0900' },
      ],
      goal: 8,
    },
    {
      gameId: '12131321',
      name: 'game 1',
      players: [
        { name: 'tom', userId: '12131321' },
        { name: 'mot', userId: '0900' },
      ],
      goal: 8,
    },
    {
      gameId: '12131321',
      name: 'game 1',
      players: [
        { name: 'tom', userId: '12131321' },
        { name: 'mot', userId: '0900' },
      ],
      goal: 8,
    },
    {
      gameId: '12131321',
      name: 'game 1',
      players: [
        { name: 'tom', userId: '12131321' },
        { name: 'mot', userId: '0900' },
      ],
      goal: 8,
    },
    {
      gameId: '12131321',
      name: 'game 1',
      players: [
        { name: 'tom', userId: '12131321' },
        { name: 'mot', userId: '0900' },
      ],
      goal: 8,
    },

    {
      gameId: 'niceoo',
      name: 'game 1',
      players: [
        { name: 'mot', userId: '0900' },
        { name: 'tom', userId: '12131321' },
        { name: 'mot', userId: '0900' },
      ],
      goal: 8,
    },
  ];
}

function joinGame(ws, gameId) {
  const data = {
    requestType: 'joinGame',
    gameId,
    date: Date.now(),
  };
  ws.send(JSON.stringify(data));
  return gameId;
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

function getGameInfo(gameId) {
  console.log(gameId);
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

function pickWhiteCard(cardIndex) {
  console.log(cardIndex);
}

function getUserID() {
  return this.userID;
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

function handleGameCreated(gameId) {
  history.push(`/games/${gameId}`);
}

function handleServerMessages(event) {
  console.log(event);
  const data = JSON.parse(event.data);
  console.log(data);
  switch (data.event) {
    case 'gameCreated': {
      console.log(data.data.game.gameId);
      handleGameCreated(data.data.game.gameId);
      break;
    }
    default: {
      console.log('do nothing');
      break;
    }
  }
}

async function connectToServer() {
  const ws = new WebSocket('ws://localhost:8080');
  await waitForOpenConnection(ws);
  ws.onmessage = handleServerMessages;
  return ws;
}

export default {
  getActiveGames,
  createGame,
  getGameInfo,
  pickWhiteCard,
  getUserID,
  connectToServer,
  joinGame,
  handleServerMessages,
};
