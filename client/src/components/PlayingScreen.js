/* eslint-disable */
import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/gameScreen.css';
import WhiteCard from './WhiteCardTemplate';
import BlackCard from './BlackCardTemplate';
import ScoreBoard from './ScoreBoard';
import GameScreenTitle from './GameScreenTitle';
import Api from '../Api';

function allPicked(gameState) {
  return gameState === 2;
}

function isCzar(player) {
  return player.status === 2;
}

function choicePicked(player) {
  return player.status === 1;
}

function chooseCard(ws, index, player) {
  if (!isCzar(player)) {
    Api.playCard(ws, index, player);
  } else {
    Api.pickCard(ws, index, player);
  }
}

const PlayingScreen = ({ ws, playerList, player, gameState, board }) => {
  const [currentPicked, setCurrentPicked] = useState(-1);

  return (
    <div>
      <GameScreenTitle
        player={player}
        gameState={gameState}
        allPicked={allPicked}
        isCzar={isCzar}
      />

      <div className="gameScreenWrapperInner">
        <div>
          <div>The black card is:</div>
          <BlackCard text={board.currentQuestionCard} />
          <div>⠀⠀</div>
        </div>
        <div className="whiteContainer">
          <div className="whiteCardChooseContainer">
            {allPicked(gameState)
              ? 'Here are all players chosen white cards'
              : choicePicked(player)
              ? 'Your white cards were:'
              : 'Choose from the following white cards:'}
            {currentPicked !== -1 &&
            !choicePicked(player) &&
            (isCzar(player) || !allPicked(gameState)) ? (
              <button
                type="button"
                className="confirmChoiceButton"
                onClick={() => {
                  chooseCard(ws, currentPicked, player);
                }}
              >
                Confirm Choice
              </button>
            ) : (
              <div />
            )}
          </div>
          {player.hand.map((val, index) => (
            <button
              className={
                index === currentPicked ? 'cardButtonPicked' : 'cardButton'
              }
              onClick={() => {
                setCurrentPicked(index);
              }}
              type="button"
            >
              <WhiteCard text={val} />
            </button>
          ))}
        </div>
        <ScoreBoard playerList={playerList} />
      </div>
    </div>
  );
};

PlayingScreen.propTypes = {
  ws: PropTypes.instanceOf(WebSocket).isRequired,
  playerList: PropTypes.instanceOf(Array).isRequired,
  player: PropTypes.instanceOf(Object).isRequired,
  board: PropTypes.instanceOf(Object).isRequired,
  gameState: PropTypes.number.isRequired,
};

export default PlayingScreen;
/* eslint-enable */
