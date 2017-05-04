// Game service
var _ = require('lodash');
var store = require('./store.service');
var cardTools = require('./card-tools.service');
var socketService = null;

function init(socket) {
  console.log('Init Game Service');
  socketService = socket;
}

function initStacks(set0, set1) {
  var stacks = {
    player0Main : set0,
    player0Discard : [],
    player0Crapette : [],

    player1Main : set1,
    player1Discard : [],
    player1Crapette : [],

    aces : [],
    streets : []
  };

  for (var p of [0,1]) {
    for (var typeName in cardTools.CardType) {
      if (cardTools.CardType.hasOwnProperty(typeName)) {
        stacks.aces.push([]);
      }
    }
  }

  for (var s = 0; s < cardTools.NUMBEROFSTREETS * 2; s++) {
    stacks.streets.push([]);
  }
  return stacks;
}

function dealStacks(stacks) {
  for (var p of [0,1]) {
    var main = stacks['player' + p + 'Main'];
    var crapette = stacks['player' + p + 'Crapette'];

    for (var i = 0; i < cardTools.CRAPETTEHIGH; i++) {
      var card = main.pop();
      crapette.push(card);
    }
    crapette[crapette.length - 1].visible = true;

    for (var s = 0; s < cardTools.NUMBEROFSTREETS; s++) {
      var card = main.pop();
      card.visible = true;
      stacks.streets[p * cardTools.NUMBEROFSTREETS + s].push(card);
    }
  }
}

function createGame() {
  const set0 = cardTools.createSet(0);
  const set1 = cardTools.createSet(1);

  var stacks = initStacks(set0, set1);
  dealStacks(stacks);

  return stacks;
}

function getGame(hash) {
  var game = store.getGame(hash);

  if (!game) {
    game = _.extend(createGame(), {
      hash
    });

    store.setGame(hash, game);
  }

  return game;
}

function newPlayer(hash) {
  console.log('New player in', hash);
  var game = getGame(hash);
  socketService.send(hash, 'game', game);
}

module.exports = {
  init: init,
  getGame: getGame,
  newPlayer: newPlayer
}
