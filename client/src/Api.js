class Api {
   
    static getActiveGames() {
        return [
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
}

export default Api;