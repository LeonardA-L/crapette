var CARDMINHIGH = 1;    // Ace
var CARDMAXHIGH = 13; // King
var NUMBEROFSTREETS = 4;
var CRAPETTEHIGH = 13;

var CardType = [
  'CLUBS',
  'HEARTS',
  'DIAMONDS',
  'SPADES'
];

function getCharFromNumeric(value) {
  var name = '' + value;
  switch (value) {
    case 1:
      name = 'A';
    break;
    case 11:
      name = 'J';
    break;
    case 12:
      name = 'Q';
    break;
    case 13:
      name = 'K';
    break;
    default:
    break;
  }

  return name;
}

function getNumericFromChar(value) {
  var numeric = parseInt(value, 10);

  switch (value) {
    case 'A':
      numeric = 1;
    break;
    case 'J':
      numeric = 11;
    break;
    case 'Q':
      numeric = 12;
    break;
    case 'K':
      numeric = 13;
    break;
    default:
    break;
  }

  return numeric;
}

function createSet (player, cardMinHigh, cardMaxHigh) {
  var cards = [];
  cardMinHigh = cardMinHigh || CARDMINHIGH;
  cardMaxHigh = cardMaxHigh || CARDMAXHIGH;
  for (var typeName in CardType) {
    if (CardType.hasOwnProperty(typeName)) {
      var type = CardType[typeName];
      for (var i = cardMinHigh; i <= cardMaxHigh; i++) {
        cards.push({
          player, type, value: i
        });
      }
    }
  }
  return shuffle(cards);
}

// -> Fisher–Yates shuffle algorithm
function shuffle(arr) {
  var m = arr.length;
  var t;
  var i;

  // While there remain elements to shuffle
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}

module.exports = {
  getCharFromNumeric: getCharFromNumeric,
  getNumericFromChar: getNumericFromChar,
  shuffle: shuffle,
  createSet: createSet,
  CardType: CardType,
  NUMBEROFSTREETS: NUMBEROFSTREETS,
  CRAPETTEHIGH: CRAPETTEHIGH
}
