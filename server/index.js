var app = require('express')();
var http = require('http').Server(app);

var config = require('./config');

var PORT = process.env.PORT || 3535;

// Services
var socketService = require('./services/socket.service');
var storeService  = require('./services/store.service');
var gameService   = require('./services/game.service');
var cronsService  = require('./services/crons.service');

socketService.init(http);
storeService.init();
gameService.init(socketService);
cronsService.init();

app.get('/', function(req, res){
  res.send('<h1>Crapette</h1><p><b>'+storeService.info()+'</b> active games.<br /><a href="https://LeonardA-L.github.io/crapette">Click to play</a></p>');
});

app.get('/status', function(req, res){
  res.send({status: 'ok'});
});

http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});
