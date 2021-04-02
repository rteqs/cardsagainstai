import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Api from '../Api';
import '../styles/lobby-styles.css';
import history from '../history';

// TODO: MAKE GAME CARDS DYNAMIC

function Lobby({ ws }) {
  const location = useLocation();
  // BREAKING CHANGE
  const [games, setGames] = useState([]);

  useEffect(() => {
    console.log(games);
    setGames(location.state.games);
  }, [location]);

  const handleJoin = (gameID) => {
    Api.joinGame(ws, gameID);
    history.push(`/games/${gameID}`);
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
            <div className="peopleContainer">
              Players:⠀
              {val.players.map((p, pindex) => (
                <div>
                  {p.name}
                  {pindex < val.players.length - 1 ? <span>,⠀</span> : <span />}
                </div>
              ))}
            </div>
            <p>Goal: {val.goal}</p>
            <button
              onClick={() => {
                handleJoin(val.gameID);
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

Lobby.propTypes = {
  ws: PropTypes.instanceOf(WebSocket).isRequired,
};

export default Lobby;
