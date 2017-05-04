// Game service
var _ = require('lodash');
var store = require('./store.service');
var cardTools = require('./card-tools.service');
var socketService = null;

function init(socket) {
  console.log('Init Game Service');
  socketService = socket;
}

function initStacks() {
  var stacks = {
    player0Main : [],
    player0Discard : [],
    player0Crapette : [],

    player1Main : [],
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

function dealStacks(stacks, set0, set1) {
  var sets = [set0, set1];
  for (var p in sets) {
    for (var i = 0; i < cardTools.CRAPETTEHIGH; i++) {
      var card = sets[p].pop();
      stacks['player' + p + 'Crapette'].push(card);
    }
    stacks['player' + p + 'Crapette'][stacks['player' + p + 'Crapette'].length - 1].visible = true;

    for (var s = 0; s < cardTools.NUMBEROFSTREETS; s++) {
      var card = sets[p].pop();
      card.visible = true;
      stacks.streets[p * cardTools.NUMBEROFSTREETS + s].push(card);
    }
  }
  stacks.player0Main = set0;
  stacks.player1Main = set1;
}

function createGame() {
  const set0 = cardTools.createSet(0);
  const set1 = cardTools.createSet(1);

  var stacks = initStacks();
  dealStacks(stacks, set0, set1);

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
