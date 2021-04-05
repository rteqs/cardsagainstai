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

const blackCards = new Map();
const whiteCards = new Map();

function loadBlackCardsFromFile() {
  fs.createReadStream('./resources/blackcards.csv')
    .pipe(csv())
    .on('data', (row) => {
      // console.log(row);
      blackCards.set(row.id, row);
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
      whiteCards.set(row.id, row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

const games = {};

function addGame(game) {
  games[game.gameId] = game;
}

function getGame(gameId) {
  if (gameId in games) {
    return games[gameId]
  }
  throw Error("Invalid gameId")
}

function getAllGames() {
  return games;
}

function updateGame(game) {
  addGame(game); // For now this just overrides the game
}

function getNCardsFromArray(n, array, idOnly) {
  // console.log(`${n}, ${array.length}, ${idOnly}`);
  const requestedSet = [];
  const clonedArray = [...array];
  for (i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * clonedArray.length);
    let element = clonedArray[index];
    clonedArray.splice(index, 1);
    if (idOnly) {
      element = element.id;
    }
    requestedSet.push(element);
  }
  // console.log(`Requestedset: ${requestedSet}`);
  return requestedSet;
}

function getQuestionCards(numCards, idOnly) {
  if (blackCards.length === 0) {
    loadBlackCardsFromFile();
  }
  return getNCardsFromArray(numCards, blackCards.values(), idOnly);
}

function getAnswerCards(numCards, idOnly) {
  if (whiteCards.length === 0) {
    loadWhiteCardsFromFile();
  }
  return getNCardsFromArray(numCards, whiteCards.values(), idOnly);
}

function getCardDataFor(cardIdList, useBlack) {
  const reqCardData = {};
  // console.log("cardIdList: " + cardIdList)
  cardIdList.forEach(cardId => {
    let cardData = null;
    if (useBlack) {
      cardData = blackCards.get(cardId);
    } else {
      cardData = whiteCards.get(cardId);
    }
    reqCardData[cardId] = cardData;
  });
  // console.log(reqCardData)
  return reqCardData;
}

loadBlackCardsFromFile();
loadWhiteCardsFromFile();
module.exports = {
  addGame,
  getGame,
  updateGame,
  getQuestionCards,
  getAnswerCards,
  getAllGames,
  getCardDataFor
};
