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
  return _gameStore[hash];
}

function setGame(hash, game) {
  _gameStore[hash] = game;
}

function getParticipants(hash) {
  return _socketStore[hash];
}

module.exports = {
  getGame: getGame,
  getParticipants: getParticipants,
  info: info,
  init: init,
  registerSocket: registerSocket,
  setGame: setGame
}
