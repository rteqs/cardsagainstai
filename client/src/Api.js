class Api {
    static userID = "yousef";

    static getActiveGames() {
        return [
            {
                "gameID": "12131321", 
                "name": "game 1", 
                "players": [{"name": "tom", "userId": "12131321"}, {"name": "mot", "userId": "0900"}],
                "goal": 8
            },
            {
                "gameID": "12131321", 
                "name": "game 1", 
                "players": [{"name": "tom", "userId": "12131321"}, {"name": "mot", "userId": "0900"}],
                "goal": 8
            },
            {
                "gameID": "12131321", 
                "name": "game 1", 
                "players": [{"name": "tom", "userId": "12131321"}, {"name": "mot", "userId": "0900"}],
                "goal": 8
            },
            {
                "gameID": "12131321", 
                "name": "game 1", 
                "players": [{"name": "tom", "userId": "12131321"}, {"name": "mot", "userId": "0900"}],
                "goal": 8
            },
            {
                "gameID": "12131321", 
                "name": "game 1", 
                "players": [{"name": "tom", "userId": "12131321"}, {"name": "mot", "userId": "0900"}],
                "goal": 8
            },
            {
                "gameID": "12131321", 
                "name": "game 1", 
                "players": [{"name": "tom", "userId": "12131321"}, {"name": "mot", "userId": "0900"}],
                "goal": 8
            },
            {
                "gameID": "12131321", 
                "name": "game 1", 
                "players": [{"name": "tom", "userId": "12131321"}, {"name": "mot", "userId": "0900"}],
                "goal": 8
            },
            
            {
                "gameID": "niceoo", 
                "name": "game 1", 
                "players": [{"name": "mot", "userId": "0900"}, {"name": "tom", "userId": "12131321"}, {"name": "mot", "userId": "0900"}, ],
                "goal": 8
            }
        ]
    }

    static createGame(name, goal, numAI) {
        console.log(name);
        console.log(goal);
        console.log(numAI);

        return "183028100";
    }

    static getGameInfo(gameID) {
        console.log(gameID)
        return {
            blackCard: {"text": "niceoo"},
            whiteCards: [{"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"},  {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "ok buddy"}, {"text": "trash"}],
            players: [{"name": "yousef", "userID": "yousef", "score": 1, "isCzar": false}, {"name": "mot", "userID": "mot", "score": 2, "isCzar": false}],
            allPicked: true,
            goal: 8,
        }
    }

    static pickWhiteCard(cardIndex) {
        console.log(cardIndex);
    }

    static endRound(index) {
        console.log("new round:", index, "won");
    }

    static getUserID() {
        return this.userID;
    }
}

export default Api;