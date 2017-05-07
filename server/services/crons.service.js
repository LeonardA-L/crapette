var store = require('./store.service');
var Repeat = require('repeat');
var config = require('../config');

function purgeGames() {
  console.log('Cron: Purging games');
  const games = store.getGameStore();
  var now = new Date();

  for (var hash in games) {
    if (games.hasOwnProperty(hash)) {
      var game = games[hash];
      var diff = (now - game.lastActivity) / 1000; // seconds

      // Check if the game is finished and has expired
      if (game.winner !== undefined && diff > config.expiration.finishedGame) {
        console.log('Purging', hash);
        store.deleteGame(hash);
      }
    }
  }
}

function init() {
  console.log('Init Crons Service');
  Repeat(purgeGames).every(config.repeat.timePurgeFinished, 's').start.in(1, 'sec');
}

module.exports = {
  init: init
}
