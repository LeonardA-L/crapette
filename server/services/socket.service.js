// SocketIO related stuff
var io;
var store = require('./store.service');

function disconnect() {
  console.log('user disconnected');
}

function gameStart(socket, params){
  console.log('New socket', params.hash);
  if (params.hash) {
    socketHash = params.hash;
    store.registerSocket(params.hash, socket);
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

module.exports = {
  init: init
}
