'use strict';

angular.module('cardsApp').factory('cards', function() {
  var CARDTYPES = [
    {
      id:0,
      name:'H',
      color:0
    },
    {
      id:1,
      name:'D',
      color:0
    },
    {
      id:2,
      name:'C',
      color:1
    },
    {
      id:3,
      name:'S',
      color:1
    }
  ];
  var CARDMINHIGH = 1;    // Ace
  var CARDMAXHIGH = 13;   // King

  function cardNamePrint (_c) {
    if(!_c){
      return '';
    }
    var name = '';
    switch(_c.value){
      case 1:
        name += '1';
      break;
      case 11:
        name += 'J';
      break;
      case 12:
        name += 'Q';
      break;
      case 13:
        name += 'K';
      break;
      default:
        name += _c.value;
      break;
    }

    name += ' '+_c.type.name;

    return name;
  }

  function createDeck (cardTypes, cardMinHigh, cardMaxHigh){
    var _cards = [];
    cardTypes = cardTypes || CARDTYPES;
    cardMinHigh = cardMinHigh || CARDMINHIGH;
    cardMaxHigh = cardMaxHigh || CARDMAXHIGH;
    for(var i=0;i<cardTypes.length;i++){
      for (var j = cardMinHigh; j <= cardMaxHigh; j++) {
        _cards.push({
          value:j,
          type:cardTypes[i],
          turned: false,
          player: null
        });
      };
    }
    return _cards;
  }

  // -> Fisher–Yates shuffle algorithm
  Array.prototype.shuffle = function () {
      var m = this.length, t, i;

      // While there remain elements to shuffle
      while (m) {
          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);

          // And swap it with the current element.
          t = this[m];
          this[m] = this[i];
          this[i] = t;
      }

      return this;
  }

  //cards = cards.shuffle();

  function copyDeckByRef (_deck) {
    var _newDeck = [];
    for(var i = 0; i < _deck.length; i++) {
      _newDeck.push(_deck[i]);
    }
    return _newDeck;
  }

  function copyDeckDeep (_deck) {
    var _newDeck = [];
    for(var i = 0; i < _deck.length; i++) {
      var c = _deck[i];
      _newDeck.push({
        value: c.value,
        type: c.type,
        player: c.player,
        turned: c.turned
      });
    }
    return _newDeck;
  }

  return {
    CARDTYPES: CARDTYPES,
    CARDMINHIGH: CARDMINHIGH,
    CARDMAXHIGH: CARDMAXHIGH,
    cardNamePrint: cardNamePrint,
    createDeck: createDeck,
    copyDeckByRef: copyDeckByRef,
    copyDeckDeep: copyDeckDeep
  };
});