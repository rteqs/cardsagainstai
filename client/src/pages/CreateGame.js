import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Api from '../Api'
import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/createGame.css'

function CreateGame() {

    let name = ""
    let goal = 8
    let numAI = 0

    const handleSubmit = () => {
        const gameID = Api.createGame(name, goal, numAI);
        console.log(gameID)
        window.location.href = `/games/${gameID}`;
    }

    return (
        <div>
            <div className="pageNavbar">
				CARDS AGAINST AI
			</div>
            <div className="createGameWrapper">
                <div className="createGameTitle">
                    Create a Game
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formGameName" onChange={(event) => {name = event.target.value;}}>
                        <Form.Label>Game Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" />
                        <Form.Text className="text-muted">
                            This will be visible to all users
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formGameLimit" onChange={(event) => {
                        if(event.target.value > 0) {
                            goal = event.target.value
                        } else {
                            goal = 8;
                        }}}>
                        <Form.Label>Score to Win</Form.Label>
                        <Form.Control type="number" placeholder="Enter Score to Win" />
                    </Form.Group>
                    <Form.Group controlId="formAILimit" onChange={(event) => {
                        if(event.target.value > 0) {
                            numAI = event.target.value
                        } else {
                            numAI = 0;
                        }}}>
                        <Form.Label>Number of AI</Form.Label>
                        <Form.Control type="number" placeholder="Enter # of AI Players" />
                    </Form.Group>

        
                    <Button variant="primary" type="button" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>
            </div>
        </div>

    )
}

export default CreateGame;