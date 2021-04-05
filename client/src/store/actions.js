// websocket actions
export const wsConnect = (host) => ({ type: 'WS_CONNECT', host });
export const wsConnecting = (host) => ({ type: 'WS_CONNECTING', host });
export const wsConnected = (socket) => ({ type: 'WS_CONNECTED', socket });
export const wsDisconnect = (host) => ({ type: 'WS_DISCONNECT', host });
export const wsDisconnected = (host) => ({ type: 'WS_DISCONNECTED', host });

// lobby actions
export const updateGameList = (gameList) => ({ type: 'updateGames', gameList });

// game actions
export const loadGame = (game, player) => ({
  type: 'loadGame',
  game: {
    gameInfo: {
      gameId: game.gameId,
      name: game.name,
      goal: game.goal,
      maxPlayers: game.maxPlayers,
    },
    playerList: game.playerList,
    player,
    czar: game.czar,
    board: game.board,
    gameState: game.state,
  },
});
export const updateGameInfo = (gameInfo) => ({
  type: 'updateGameInfo',
  gameInfo,
});
export const updatePlayerList = (playerList) => ({
  type: 'updatePlayerList',
  playerList,
});
export const updateBoard = (board) => ({ type: 'updateBoard', board });
export const updatePlayer = (player) => ({ type: 'updatePlayer', player });
export const updateGameState = (gameState) => ({
  type: 'updateGameState',
  gameState,
});
export const updateCzar = (czar) => ({ type: 'updateCzar', czar });
