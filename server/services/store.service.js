// Store
var _socketStore;
var _gameStore;

function info() {
  console.log(Object.keys(_socketStore));
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
