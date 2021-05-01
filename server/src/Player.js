const { v4: uuidv4 } = require('uuid');

function Player(socket, name) {
  this.playerId = uuidv4(); // uuid
  this.name = name; //
  this.hand = []; // number (cardId) | Array
  this.score = 0; // number
  this.host = false; // if player is a host
  this.status = 0; // 0 card not played, 1 card played, 2 czar
  this.socket = socket;
}

/**
 * Factory method for Player
 * @returns Player object
 */
function createPlayer(socket) {
  return new Player(socket);
}

module.exports = { createPlayer };
