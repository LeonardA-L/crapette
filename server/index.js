var app = require('express')();
var http = require('http').Server(app);

var config = require('./config');

var io = require('socket.io')(http);

var PORT = process.env.PORT || 3535;

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});


http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('hello', {salut:'ça va'});

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('game:start', function(params){
    console.log(params);
  });
});