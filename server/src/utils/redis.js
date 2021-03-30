const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

// const client = redis.createClient();

// client.on('connect', () => {
//   console.log('connected to redis');
// });

// client.on('error', (error) => {
//   console.error(error);
// });

// TODO: Add redis functionality

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

function getQuestionCards(numCards) {
  return [`TODO: ${numCards} question cards!`]
}

function getAnswerCards(numCards) {
  return [`TODO: ${numCards} answer cards!`]
}

module.exports = {
  addGame,
  getGame,
  updateGame,
  getQuestionCards,
  getAnswerCards
}
