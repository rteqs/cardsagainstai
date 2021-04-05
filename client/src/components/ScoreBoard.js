import '../styles/gameScreen.css';
import PropTypes from 'prop-types';

const ScoreBoard = ({ playerList }) => (
  <div className="gameScoreboard">
    <div>SCOREBOARD</div>
    <hr />
    {playerList.map((val) => (
      <div>
        {val.playerId} {val.status === 2 ? '(Czar)' : ''}: {val.score}
      </div>
    ))}
  </div>
);

ScoreBoard.propTypes = {
  playerList: PropTypes.instanceOf(Array).isRequired,
};

export default ScoreBoard;
