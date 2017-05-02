// SocketIO related stuff
var io;
var store = require('./store.service');
var game = require('./game.service');

function disconnect() {
  console.log('user disconnected');
}

function gameStart(socket, params){
  if (params.hash) {
    socketHash = params.hash;
    store.registerSocket(params.hash, socket);
    game.newPlayer(params.hash);
  }
}

function registerEvent(event, socket, fn) {
  socket.on(event, function(msg) {
    fn(socket, msg);
  });
}

function setup(socket) {
  console.log('a user connected');

  registerEvent('disconnect', socket, disconnect);
  registerEvent('game:start', socket, gameStart);
}

function init(http) {
  console.log('Init Socket Service');
  io = require('socket.io')(http);

  io.on('connection', setup);
}

function send(hash, event, msg) {
  var sockets = store.getParticipants(hash);

  if (!sockets) {
    return;
  }

  for (s of sockets) {
    s.emit(event, msg);
  }
}

module.exports = {
  init: init,
  send: send
}
