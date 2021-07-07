/* eslint-disable */
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/gameScreen.css';
import IdleScreen from '../components/IdleScreen';
import PlayingScreen from '../components/PlayingScreen';

const GameScreen = function () {
  const ws = useSelector((state) => state.websocket.ws);
  const gameInfo = useSelector((state) => state.game.gameInfo);
  const playerList = useSelector((state) => state.game.playerList);
  const board = useSelector((state) => state.game.board);
  const player = useSelector((state) => state.game.player);
  const gameState = useSelector((state) => state.game.gameState);
  const czar = useSelector((state) => state.game.czar);

  function displayGameState(state) {
    switch (state) {
      case 0:
        return (
          <IdleScreen
            ws={ws}
            playerList={playerList}
            playerId={player.playerId}
            gameInfo={gameInfo}
          />
        );

      case 1:
      case 2:
        return (
          // FRONTEND-CLIENT: the game components are passed in to be used by PlayingScreen
          <PlayingScreen
            ws={ws}
            playerList={playerList}
            player={player}
            gameInfo={gameInfo}
            gameState={gameState}
            board={board}
          />
        );
    }
  }

  return (
    <div className="gameScreenWrapper">
      {displayGameState(gameState, ws, playerList)}
    </div>
  );
};

export default GameScreen;

/* eslint-enable */
