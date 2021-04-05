import '../styles/gameScreen.css';
import PropTypes from 'prop-types';
import ScoreBoard from './ScoreBoard';
import Api from '../Api';

const IdleScreen = ({ ws, playerList, gameInfo, playerId }) => (
  <div>
    <div className="gameScreenTitle">Waiting for game to start</div>
    <button
      type="button"
      className="confirmChoiceButton"
      onClick={() => {
        console.log(playerList);
        Api.startGame(ws, playerId, gameInfo.gameId);
      }}
    >
      Start Game
    </button>
    <ScoreBoard playerList={playerList} />
  </div>
);

IdleScreen.propTypes = {
  ws: PropTypes.instanceOf(WebSocket).isRequired,
  playerList: PropTypes.instanceOf(Array).isRequired,
  gameInfo: PropTypes.instanceOf(Object).isRequired,
  playerId: PropTypes.instanceOf(String).isRequired,
};

export default IdleScreen;
