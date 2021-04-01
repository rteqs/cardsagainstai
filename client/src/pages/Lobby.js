import React from 'react';
import Api from '../Api';
import '../styles/lobby-styles.css'

// TODO: MAKE GAME CARDS DYNAMIC

function Lobby() {
    const games = Api.getActiveGames();
    return (
        <div style={{overflowX: "hidden", backgroundColor: "black", height: "100vh"}}> 
            <div className="lobbyNavbar">
				CARDS AGAINST AI
			</div>
            <div className="lobbyWrapper">
                <button type="button" className="addGameContainer" onClick={() => { window.location.href = `/createGame/`; }}>
                    Create A Game
                </button>
                {games.map((val) => 
                    <div className="gameContainer">
                        <p>Name: {val.name}</p>
                        <div className="peopleContainer">
                            Players:⠀
                            {val.players.map((p, pindex) =>
                                <div>{p.name}{(pindex < val.players.length - 1)? <span>,⠀</span>: <span />}</div>
                                
                            )}
                        </div>
                        <p>Goal: {val.goal}</p>
                        <button onClick={() => { window.location.href = `/games/${val.gameID}`; }} type="button" className="startGameButton">Join Game</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Lobby;