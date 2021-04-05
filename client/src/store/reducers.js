import { combineReducers } from 'redux';
import Api from '../Api';

const websocketInitialState = { ws: null, connected: false };
const gameInitialState = {
  gameInfo: { gameId: null, name: null, goal: 0, maxPlayer: 0 },
  gameState: 0,
  czar: null,
  player: null,
  board: { currentQuestionCard: null, currentAnswerCards: [], turnNum: 0 },
  playerList: [],
};

const websocketReducer = (state = { ...websocketInitialState }, action) => {
  switch (action.type) {
    case 'WS_CONNECTED':
      console.log('Connected to server');
      Api.getActiveGames(action.socket);
      return { ws: action.socket, connected: true };
    default:
      return state;
  }
};

const lobbyReducer = (state = [], action) => {
  switch (action.type) {
    case 'updateGames':
      return action.gameList;
    default:
      return state;
  }
};

const gameReducer = (state = { ...gameInitialState }, action) => {
  switch (action.type) {
    case 'loadGame':
      console.log('loading game', action.game);
      return { ...action.game };
    case 'updateGameInfo':
      return { ...state, gameInfo: action.gameInfo };
    case 'updatePlayerList':
      return { ...state, playerList: action.playerList };
    case 'updateBoard':
      return { ...state, board: action.board };
    case 'updatePlayer':
      return { ...state, player: action.player };
    case 'updateGameState':
      return { ...state, gameState: action.gameState };
    case 'updateCzar':
      return { ...state, czar: action.czar };
    default:
      return state;
  }
};

const reducers = combineReducers({
  websocket: websocketReducer,
  lobby: lobbyReducer,
  game: gameReducer,
});

export default reducers;
