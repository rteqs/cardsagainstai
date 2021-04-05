/* eslint-disable*/
import * as actions from './actions';
import history from '../history';
import Api from '../Api';

const socketMiddleware = () => {
  let socket = null;

  const onClose = (store) => () => {
    store.dispatch(actions.wsDisconnected());
  };

  const onMessage = (store) => (event) => {
    const payload = JSON.parse(event.data);
    console.log('receiving server message');
    console.log(payload);

    switch (payload.event) {
      case 'joinGame':
        console.log('Joining game');
        const { game } = payload;
        const { player } = payload;
        const { gameId } = game;
        store.dispatch(actions.loadGame(game, player));
        history.push(`/games/${gameId}`);
        break;

      case 'getGameList':
        store.dispatch(actions.updateGameList(payload.gameList));
        history.push('/lobby');
        break;

      case 'updatePlayerList':
        store.dispatch(actions.updatePlayerList(payload.filteredPlayerList));
        break;

      case 'gameStarted':
        if (payload.status === 200) {
          store.dispatch(actions.updateGameState(1));
        }
        break;

      case 'updateBoard':
        store.dispatch(actions.updateBoard(payload.board));
        break;

      case 'updatePlayer':
        store.dispatch(actions.updatePlayer(payload.player));
        store.dispatch(actions.updateCzar(payload.czar));
        store.dispatch(actions.updateGameState(payload.state));
        break;

      default:
        break;
    }
  };

  // the middleware part of this function
  return (store) => (next) => async (action) => {
    switch (action.type) {
      case 'WS_CONNECT':
        if (socket !== null) {
          socket.close();
        }

        // connect to the remote host
        socket = await Api.connectToServer();

        // websocket handlers
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        store.dispatch(actions.wsConnected(socket));
        break;

      case 'WS_DISCONNECT':
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        console.log('websocket closed');
        break;

      case 'NEW_MESSAGE':
        console.log('sending a message', action.msg);
        socket.send(
          JSON.stringify({ command: 'NEW_MESSAGE', message: action.msg })
        );
        break;

      default:
        console.log('the next action:', action);
        return next(action);
    }
  };
};

export default socketMiddleware();
