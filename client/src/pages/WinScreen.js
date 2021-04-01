/* eslint-disable */
import React from 'react';
import '../styles/winScreen.css';
import Api from '../Api'


export default class GameScreen extends React.Component {
        constructor(props) {
            super(props)
            const gameInfo = Api.getGameInfo(props.gameID);
            this.state = ({
                players: gameInfo.players.sort((a, b) => (b.score - a.score)),
            })
        }
        render() {
            
            return (
                <div className="winScreenWrapper">
                    <div className="winTitle">
                        The game is over, here are the results:
                    </div>
                    <div className="winGameScoreboard">
                        <div>SCOREBOARD</div>
                        <hr />
                        {this.state.players.map((val) => <div>{val.name} {val.isCzar? "(Czar)": ""}: {val.score}</div>)}
                    </div>
                    <button className="lobbyButton" type="button" onClick={() => { window.location.href = "/lobby"; }}>
                        Back to the Lobby
                    </button>
                </div>
            )
        }
}
/* eslint-enable */
