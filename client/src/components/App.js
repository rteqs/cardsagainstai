import React from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Lobby from '../pages/Lobby';
// import GameScreen from '../pages/GameScreen';
import GameScreen from '../pages/GameScreenFunctional';
import { wsConnect } from '../store/actions';
import CreateGame from '../pages/CreateGame';
import WinScreen from '../pages/WinScreen';
import Authenticate from '../pages/Authenticate';
// import Api from '../Api';

export default function App() {
  const dispatch = useDispatch();

  return (
    <Switch>
      <Route path="/createGame/" component={CreateGame} />
      <Route path="/games/:gameID/win" component={WinScreen} />
      <Route path="/games/:gameID" component={GameScreen} />
      <Route path="/lobby" component={Lobby} />
      <Route path="/auth" component={Authenticate} />
      <Route path="/auth/google" component={Authenticate} />
      <Route
        path="/"
        render={() => (
          <div>
            <div className="pageNavbar">CARDS AGAINST AI</div>
            <div className="pageWrapper">
              <p>
                Welcome message to welcome the user kindly to this project TODO.
              </p>
              <button
                className="lobbyButton"
                type="button"
                onClick={() => {
                  dispatch(wsConnect('ws://localhost:8080'));
                }}
              >
                Go to The Lobby
              </button>
            </div>
          </div>
        )}
      />
    </Switch>
  );
}
