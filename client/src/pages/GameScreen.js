/* eslint-disable */
mport React from 'react';
import '../styles/gameScreen.css';
import WhiteCard from '../components/WhiteCardTemplate';
import BlackCard from '../components/BlackCardTemplate';
import Api from '../Api';
import history from '../history';

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props);
    const gameInfo = Api.getGameInfo(props.gameID);
    let isCzar = false;
    for (const player of gameInfo.players) {
      if (player.userID === Api.getUserID()) {
        if (player.isCzar) {
          isCzar = true;
        }
      }
    }
    this.state = {
      gameID: props.match.params.gameID,
      blackCard: gameInfo.blackCard,
      whiteCards: gameInfo.whiteCards,
      players: gameInfo.players.sort((a, b) => b.score - a.score),
      allPicked: gameInfo.allPicked,
      goal: gameInfo.goal,
      choicePicked: false,
      currentPicked: -1,
      isCzar: isCzar,
    };
    this.pickWhiteCard = this.pickWhiteCard.bind(this);
    this.ws = props.ws;
  }

  pickWhiteCard(index) {
    if (!this.state.isCzar) {
      Api.pickWhiteCard(index);
    } else {
      Api.endRound(index);
    }
  }

  render() {
    console.log();
    for (const player of this.state.players) {
      if (player.score >= this.state.goal) {
        history.push(`/games/${this.state.gameID}/win`);
      }
    }
    return (
      <div className="gameScreenWrapper" style="background-color: blue;">
        {this.state.allPicked ? (
          this.state.isCzar ? (
            <div className="gameScreenTitle">
              You are the Czar, judge the following card combos:
            </div>
          ) : (
            <div className="gameScreenTitle">
              The Czar is making their choice:
            </div>
          )
        ) : this.state.choicePicked ? (
          <div className="gameScreenTitle">
            Waiting on other players to make their picks
          </div>
        ) : (
          <div className="gameScreenTitle">
            You are a player, pick the most suitable card combo:
          </div>
        )}

        <div className="gameScreenWrapperInner" style="background-color: tomato;">
          <div className="blackCardContainer">
            <div>The black card chosen is:</div>
            <BlackCard text={this.state.blackCard.text} />
            <div>⠀⠀</div>
          </div>
          <div className="whiteContainer" style="background-color: Gray;">
            <div className="whiteCardChooseContainer" style="background-color: Violet;">
              {this.state.allPicked
                ? 'Here are all players chosen white cards'
                : this.state.choicePicked
                ? 'Your white cards were:'
                : 'Choose from the following white cards:'}
              {this.state.currentPicked != -1 &&
              !this.state.choicePicked &&
              (this.state.isCzar || !this.state.allPicked) ? (
                <button
                  type="button"
                  className="confirmChoiceButton"
                  onClick={() => {
                    this.pickWhiteCard(this.state.currentPicked);
                    const copy = this.state;
                    copy.choicePicked = true;
                    this.setState(copy);
                  }}
                >
                  Confirm Choice
                </button>
              ) : (
                <div />
              )}
            </div>
            {this.state.whiteCards.map((val, index) => (
              <button
                className={
                  index === this.state.currentPicked
                    ? 'cardButtonPicked'
                    : 'cardButton'
                }
                onClick={() => {
                  const copy = this.state;
                  copy.currentPicked = index;
                  this.setState(copy);
                }}
                type="button"
              >
                <WhiteCard text={val.text} />
              </button>
            ))}
          </div>
          <div className="gameScoreboard" style="background-color: Green;">
            <div>SCOREBOARD</div>
            <hr />
            {this.state.players.map((val) => (
              <div>
                {val.name} {val.isCzar ? '(Czar)' : ''}: {val.score}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const GameScreenWrapper = ({ ws }) => {
  React.useEffect(() => {
    ws.addEventListener('message', (event) => {
      const data = event.data;
      if (data.event === 'playCard') {
        console.log(data);
      }
    });
  }, []);
  return (
    <div>
      <GameScreen />
    </div>
  );
};

/* eslint-enable */
