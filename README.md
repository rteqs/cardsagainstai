# Cards Agaisnt AI

## Instructions for running the project
1. Open up a terminal and navigate to the .../cardsagainsai/server directory
2. Run the command `npm run dev` to start up the backend.
3. While the backend starts up open up a new terminal and navigate to the .../cardsagainstai/client directory.
4. Run the command `npm start` to start the React frontend. Note: For some reason this takes a while, like almost a minute the first time it is run.

Note: make sure that the backend is up before attempting to start the frontend as if you don't you may be errors about websocket connection.

/client
- contains all of the necessary code for running the React frontend part of the project
/client/src/store/wsmiddleware.js
- This file is the frontend-client responsible for recieving responses from the backend-client and handling the frontend's reaction by saving certain json objects (retrieved from actions.js) that are then stored in the 'store' variable which is TODO (I believe it is something to do with redux?)
/client/src/store/actions.js
- contains many actions in the form of some TODO (wording) lambda looking functions that are exported and simply return a json object with a 'type' attribute as well as pertinent information such as game info or list of players
/client/src/Api.js
- contains many functions that take in some data and send out an appropriate request to the backend-client via the websocket connection, which is also passed into the functions.
/client/src/components/PlayingScreen.js
- This file contains the HTML React looking stuff (TODO: Wording/correctness) with logic actually built into the HTML looking stuff. The HTML looking stuff gets it's data from some passed in variables presumably from GameScreenFunctional.js. Note: What happenes on button press in the playing screen is handled here.
/client/src/pages/GameScreenFunctional.js
- Really just contains a switch statement which will show either the IdleScreen, or the PlayingScreen. Here is where all of the pertinent information such as the websocket, playerList, player, gameInfo, gameState, and board are passed in to the mysteriously appearing variables in PlayingScreen.js. This pertinent information is taken gotten using the useSelector method which is imported from 'react-redux' which is likely where the information recieved over the websocket by the wsmiddleware.js code was stored/updated ("dispatched" as it were).


/server
- all the Node.js compenents necessary for running the Node.js backend
/server/game.js
- contains the definition for the Game object including methods for handling specific Game related events such as handleJoin, handleLeave, handleSelect, etc.
/server/index.js
- contains the code for interacting with the web socket to communicate with the frontend-client. This file contains the code that we would refer to as the backend-client, in charge of recieveing requests from the frontend-client and doing the approriate actions to send back the appropriate response to the frontend-client also throught the socket connection.
/server/Player.js
- contains information about the Player object including a factory method for creating one
/server/app.js
- seems to contain pertinent code for dealing with different types of logging in, namely through Google, Twitter, and Github. This file is not in active use as of 7/16/21.
/server/test_ws.html
- a small html file with some websocket connection capability in order to test the backend-client's functionality without needing to launch the frontend.

