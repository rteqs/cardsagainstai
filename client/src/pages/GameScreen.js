import React from 'react';
import '../styles/gameScreen.css';
import WhiteCard from '../components/WhiteCardTemplate';
import BlackCard from '../components/BlackCardTemplate';

export default function GameScreen(gameID) {
        const blackCard = {"text": "niceoo"}
        const whiteCards = [{"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"},  {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "trash"}];
        const players = [{"name": "tom", "score": 2}, {"name": "mot", "score": 4}].sort((a, b) => (b.score - a.score))
        console.log(gameID)
        return (
            <div className="gameScreenWrapper">
                    <div>
                        <div>The black card is:</div>
                        <BlackCard text={blackCard.text}/>
                        <div>⠀⠀</div>
                    </div>
                    <div className="whiteContainer">
                        <div>Choose from the following white cards:</div>
                        {whiteCards.map((val) => <WhiteCard text={val.text}/>)}
                    </div>
                    <div className="gameScoreboard">
                        <div>SCOREBOARD</div>
                        <hr />
                        {players.map((val) => <div>{val.name}: {val.score}</div>)}
                    </div>
            </div>
        )    
}
