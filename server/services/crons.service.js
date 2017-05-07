var store = require('./store.service');
var Repeat = require('repeat');
var config = require('../config');

function purgeGames() {
  const games = store.getGameStore();
  var now = new Date();

  for (var hash in games) {
    if (games.hasOwnProperty(hash)) {
      var game = games[hash];
      var diff = (now - game.lastActivity) / 1000; // seconds

      // Check if the game is finished and has expired
      if (game.winner !== undefined && diff > config.expiration.finishedGame) {
        store.deleteGame(hash);
      }
      // Check if the game has expired
      else if (diff > config.expiration.unfinishedGame) {
        store.deleteGame(hash);
      }
    }
  }

}

function purgeSockets() {
  const gamesSockets = store.getSocketStore();

  for (var hash in gamesSockets) {
    if (gamesSockets.hasOwnProperty(hash)) {
      var gameSockets = gamesSockets[hash];
      for (var s in gameSockets) {
        const socket = gameSockets[s];
        if (!socket.connected) {
          gameSockets.splice(s, 1);
        }
      }
    }
  }

}

function init() {
  console.log('Init Crons Service');
  Repeat(purgeGames).every(config.repeat.timePurgeGames, 's').start.in(1, 'sec');
  Repeat(purgeSockets).every(config.repeat.timePurgeSockets, 's').start.in(1, 'sec');
}

module.exports = {
  init: init
}
