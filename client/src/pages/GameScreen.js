/* eslint-disable */
import React from 'react';
import '../styles/gameScreen.css';
import WhiteCard from '../components/WhiteCardTemplate';
import BlackCard from '../components/BlackCardTemplate';
import Api from '../Api'

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
            this.state = ({
                gameID: props.match.params.gameID,
                blackCard: gameInfo.blackCard,
                whiteCards: gameInfo.whiteCards,
                players: gameInfo.players.sort((a, b) => (b.score - a.score)),
                allPicked: gameInfo.allPicked,
                goal: gameInfo.goal,
                choicePicked: false,
                currentPicked: -1,
                isCzar: isCzar,
            });
        }

        render() {
            for (const player of this.state.players) {
                if (player.score >= this.state.goal) {
                    window.location.href = `/games/${this.state.gameID}/win`;
                }
            }
            return (
                <div className="gameScreenWrapper">
                    {this.state.allPicked?
                        (this.state.isCzar? 
                            <div className="gameScreenTitle">You are the Czar, judge the following card combos:</div>
                            : <div className="gameScreenTitle">Here are every players choices (the Czar is making their choice):</div>)
                        : (this.state.choicePicked?
                            <div className="gameScreenTitle">Waiting on other players to make their picks</div>
                            : <div className="gameScreenTitle">You are a player, pick the most suitable card combo:</div>)}
                    
                    <div className="gameScreenWrapperInner">
                            <div>
                                <div>The black card is:</div>
                                <BlackCard text={this.state.blackCard.text}/>
                                <div>⠀⠀</div>
                            </div>
                            <div className="whiteContainer">
                                <div className="whiteCardChooseContainer">
                                    {this.state.allPicked? "Here are all players chosen white cards": "Choose from the following white cards:"}
                                    {(this.state.currentPicked != -1) && (!this.state.choicePicked)? 
                                    <button type="button" className="confirmChoiceButton" onClick={() => {Api.pickWhiteCard(this.state.currentPicked); const copy = this.state; copy.choicePicked =  true; this.setState(copy)}}>
                                        Confirm Choice
                                    </button> : <div />}
                                </div>
                                {this.state.whiteCards.map((val, index) => <button className={(index === this.state.currentPicked)? "cardButtonPicked": "cardButton"} onClick={() => {const copy = this.state; copy.currentPicked = index; this.setState(copy)}} type="button">
                                                            <WhiteCard text={val.text}/>
                                                        </button>)}
                            </div>
                            <div className="gameScoreboard">
                                <div>SCOREBOARD</div>
                                <hr />
                                {this.state.players.map((val) => <div>{val.name} {val.isCzar? "(Czar)": ""}: {val.score}</div>)}
                            </div>
                    </div>
                </div>
            )    
        }
}
/* eslint-enable */
