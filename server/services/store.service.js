// Store
var _socketStore;

function info() {
  console.log(Object.keys(_socketStore));
}

function init() {
  console.log('Init Store Service');
  _socketStore = {};
}

function registerSocket(hash, socket) {
  if (!_socketStore[hash]) {
    _socketStore[hash] = [];
  }
  _socketStore[hash].push(socket);
}

module.exports = {
  info: info,
  init: init,
  registerSocket: registerSocket
}
