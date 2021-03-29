const { v4: uuidv4 } = require('uuid');

function Player(playerId) {
  this.playerId = playerId; // uuid
  this.hand = []; // number (cardId) | Array
  this.score = 0; // number
  this.host = false; // if player is a host
  this.status = 0; // 0 card not played, 1 card played, 2 czar
}

/**
 * Factory method for Player
 * @returns Player object
 */
function createPlayer() {
  const id = uuidv4();
  return new Player(id);
}

module.exports = { createPlayer };
