// Game service
var store = require('./store.service');
var socketService = null;

function init(socket) {
  console.log('Init Game Service');
  socketService = socket;
}

function getGame(hash) {
  var game = store.getGame(hash);

  if (!game) {
    game = {
      hash: hash
    };
    // TODO init
    store.setGame(hash, game);
  }

  return game;
}

function newPlayer(hash) {
  console.log('New player in', hash);
  var game = getGame(hash);
  socketService.send(hash, 'game', game);
}

module.exports = {
  init: init,
  getGame: getGame,
  newPlayer: newPlayer
}
