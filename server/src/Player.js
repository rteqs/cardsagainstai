const { v4: uuidv4 } = require('uuid');

function Player(ws, name) {
  this.playerId = uuidv4(); // uuid
  this.name = name; //
  this.hand = []; // number (cardId) | Array
  this.score = 0; // number
  this.host = false; // if player is a host
  this.status = 0; // 0 card not played, 1 card played, 2 czar
  this.ws = ws;
}

/**
 * Factory method for Player
 * @returns Player object
 */
function createPlayer(ws) {
  return new Player(ws);
}

module.exports = { createPlayer };
