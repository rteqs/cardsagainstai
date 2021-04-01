// const redis = require('redis');
// const { v4: uuidv4 } = require('uuid');

// const client = redis.createClient();

// client.on('connect', () => {
//   console.log('connected to redis');
// });

// client.on('error', (error) => {
//   console.error(error);
// });

// TODO: Add redis functionality

const csv = require('csv-parser');
const fs = require('fs');

const blackCards = []
const whiteCards = []

function loadBlackCardsFromFile() {
  fs.createReadStream('./resources/blackcards.csv')
    .pipe(csv())
    .on('data', (row) => {
      // console.log(row);
      blackCards.push(row)
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

function loadWhiteCardsFromFile() {
  fs.createReadStream('./resources/whitecards.csv')
    .pipe(csv())
    .on('data', (row) => {
      // console.log(row);
      whiteCards.push(row)
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

const games = {}

function addGame(game) {
  games[game.gameId] = game
}

function getGame(gameId) {
  return games[gameId]
}

function updateGame(game) {
  addGame(game) // For now this just overrides the game
}

function getNCardsFromArray(n, array, idOnly) {
  console.log(n + ", " + array.length + ", " + idOnly )
  let requestedSet = [];
  let clonedArray = [...array]; 
  for (i = 0; i < n; i++) {
    let index = Math.floor(Math.random()*clonedArray.length)
    let element = clonedArray[index]
    clonedArray.splice(index, 1)
    if (idOnly) {
      element = element.id
    }
    requestedSet.push(element);
  }
  console.log("Requestedset: " + requestedSet)
  return requestedSet;
}

function getQuestionCards(numCards, idOnly) {
  return getNCardsFromArray(numCards, blackCards, idOnly)
}

function getAnswerCards(numCards, idOnly) {
  return getNCardsFromArray(numCards, whiteCards, idOnly)
}

loadBlackCardsFromFile()
loadWhiteCardsFromFile()
module.exports = {
  addGame,
  getGame,
  updateGame,
  getQuestionCards,
  getAnswerCards
}
