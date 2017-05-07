var app = require('express')();
var http = require('http').Server(app);

var config = require('./config');

var PORT = process.env.PORT || 3535;

// Services
var socketService = require('./services/socket.service');
var storeService  = require('./services/store.service');
var gameService   = require('./services/game.service');
var cronsService  = require('./services/crons.service');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

socketService.init(http);
storeService.init();
gameService.init(socketService);
cronsService.init();

app.use(allowCrossDomain);

app.get('/', function(req, res){
  res.send('<h1>Crapette</h1><p><b>'+storeService.info().active+'</b> active games.<br /><a href="https://LeonardA-L.github.io/crapette">Click to play</a></p>');
});

app.get('/status', function(req, res){
  res.send({status: 'ok'});
});

app.get('/games', function(req, res){
  res.send(storeService.info());
});

http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});
