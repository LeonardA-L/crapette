// Store
var _ = require('lodash');
var _socketStore;
var _gameStore;

function info() {
  var games = Object.keys(_gameStore).map((k) => _gameStore[k]);
  var sockets = []
  Object.keys(_socketStore).map((s) => _socketStore[s].map(a => 1)).forEach((a) => sockets.push(...a));
  return {
    active: games.length,
    finished: games.filter((g) => g.winner).length,
    unfinished: games.filter((g) => !g.winner).length,
    sockets: sockets.length
  };
}

function init() {
  console.log('Init Store Service');
  _socketStore = {};
  _gameStore = {};
}

function registerSocket(hash, socket) {
  if (!_socketStore[hash]) {
    _socketStore[hash] = [];
  }
  _socketStore[hash].push(socket);
}

function getGame(hash) {
  if (_gameStore[hash]) {
    _gameStore[hash].lastActivity = new Date();
  }
  return _gameStore[hash];
}

function setGame(hash, game) {
  game.lastActivity = new Date();
  _gameStore[hash] = game;
}

function getParticipants(hash) {
  return _socketStore[hash];
}

function getGameStore() {
  return _gameStore;
}

function deleteGame(hash) {
  delete _gameStore[hash];
  delete _socketStore[hash];
}

function getSocketStore() {
  return _socketStore;
}

module.exports = {
  deleteGame: deleteGame,
  getGame: getGame,
  getGameStore: getGameStore,
  getParticipants: getParticipants,
  getSocketStore: getSocketStore,
  info: info,
  init: init,
  registerSocket: registerSocket,
  setGame: setGame
}
