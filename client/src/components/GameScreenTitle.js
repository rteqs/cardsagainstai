import '../styles/gameScreen.css';
import PropTypes from 'prop-types';

function playingTitle(player, gameState, allPicked, isCzar) {
  return (
    <div>
      {isCzar(player) ? (
        <div className="gameScreenTitle">
          You are the Czar, judge the following card combos:
        </div>
      ) : (
        <div className="gameScreenTitle">The Czar is making their choice:</div>
      )}
    </div>
  );
}

function judgingTitle(player, gameState, allPicked, isCzar) {
  return (
    <div>
      {isCzar(player) ? (
        <div className="gameScreenTitle">
          Waiting on other players to make their picks
        </div>
      ) : (
        <div className="gameScreenTitle">
          You are a player, pick the most suitable card combo:
        </div>
      )}
    </div>
  );
}

const GameScreenTitle = ({ player, gameState, allPicked, isCzar }) => (
  <div>
    {allPicked(gameState)
      ? playingTitle(player, gameState, allPicked, isCzar)
      : judgingTitle(player, gameState, allPicked, isCzar)}
  </div>
);

GameScreenTitle.propTypes = {
  player: PropTypes.instanceOf(Object).isRequired,
  gameState: PropTypes.number.isRequired,
  allPicked: PropTypes.instanceOf(Function).isRequired,
  isCzar: PropTypes.instanceOf(Function).isRequired,
};

export default GameScreenTitle;
