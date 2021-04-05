import React from 'react';
import { useSelector } from 'react-redux';
import Api from '../Api';
import '../styles/lobby-styles.css';
import history from '../history';

// TODO: MAKE GAME CARDS DYNAMIC

function Lobby() {
  const games = useSelector((state) => state.lobby);
  const ws = useSelector((state) => state.websocket.ws);

  const handleJoin = (gameID) => {
    Api.joinGame(ws, gameID);
  };

  return (
    <div
      style={{ overflowX: 'hidden', backgroundColor: 'black', height: '100vh' }}
    >
      <div className="lobbyNavbar">CARDS AGAINST AI</div>
      <div className="lobbyWrapper">
        <button
          type="button"
          className="addGameContainer"
          onClick={() => {
            history.push(`/createGame/`);
          }}
        >
          Create A Game
        </button>
        {games.map((val) => (
          <div className="gameContainer">
            <p>Name: {val.name}</p>
            {val.numberOfPlayer === 0 ? (
              <div />
            ) : (
              <div className="peopleContainer">
                Players:⠀{val.players.length}
              </div>
            )}
            <p>Goal: {val.goal}</p>
            <button
              onClick={() => {
                handleJoin(val.gameId);
              }}
              type="button"
              className="startGameButton"
            >
              Join Game
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lobby;
