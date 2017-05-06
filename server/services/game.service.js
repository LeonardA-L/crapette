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

  const player0CrapetteCard = stacks.player0Crapette[stacks.player0Crapette.length - 1];
  const player1CrapetteCard = stacks.player1Crapette[stacks.player1Crapette.length - 1];

  var firstPlayerId = player1CrapetteCard.value > player0CrapetteCard.value ? 1 : 0;

  stacks.starter = firstPlayerId;

  return stacks;
}

function getGame(hash) {
  var game = store.getGame(hash);

  if (!game) {
    game = _.extend(createGame(), {
      hash,
      starter: 1
    });

    store.setGame(hash, game);
  }

  return game;
}

function pick(hash, message) {
  console.log('Pick card', hash, message)
  socketService.send(hash, 'game:pick', message);

  // Persist
  var game = store.getGame(hash);
  var stackFrom = findStackInGame(game, message.stack);
  var card = stackFrom[stackFrom.length - 1];
  card.visible = true;
}

function push(hash, message) {
  console.log('Push card', hash, message)
  socketService.send(hash, 'game:push', message);

  // Persist
  var game = store.getGame(hash);
  var stackFrom = findStackInGame(game, message.stackFrom);
  var stackTo = findStackInGame(game, message.stackTo);
  var card = stackFrom.pop();
  card.visible = true;
  stackTo.push(card);
}

function turn(hash, message) {
  console.log('Turn change', hash, message)

  // Persist
  var game = store.getGame(hash);
  game.starter = message.player;
}

function findStackInGame(game, stackName) {
  if (stackName.includes('ace') || stackName.includes('street')) {
    var spl = stackName.split('-');
    var type = spl[0]+'s';
    var idx = parseInt(spl[1]);
    return game[type][idx];
  } else {
    return game[stackName];
  }
}

function newPlayer(hash) {
  console.log('New player in', hash);
  var game = getGame(hash);
  socketService.send(hash, 'game', game);
}

module.exports = {
  init: init,
  getGame: getGame,
  newPlayer: newPlayer,
  pick: pick,
  push: push,
  turn: turn
}
