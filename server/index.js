var app = require('express')();
var http = require('http').Server(app);

var config = require('./config');

var PORT = process.env.PORT || 3535;

// Services
var socketService = require('./services/socket.service');
var storeService = require('./services/store.service');
var gameService = require('./services/game.service');

socketService.init(http);
storeService.init();
gameService.init(socketService);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});
