import React from 'react';
import '../styles/gameScreen.css';
import WhiteCard from '../components/WhiteCardTemplate';
import BlackCard from '../components/BlackCardTemplate';

export default function GameScreen(gameID) {
        const blackCard = {"text": "niceoo"}
        const whiteCards = [{"text": "ok buddy"}, {"text": "trash"}];
        console.log(gameID)
        return (
            <div className="gameScreenWrapper">
                <div className="blackContainer">
                    <BlackCard text={blackCard.text}/>
                </div>
                <div className="whiteContainer">
                    {whiteCards.map((val) => <WhiteCard text={val.text}/>)}
                </div>
            </div>
        )    
}
