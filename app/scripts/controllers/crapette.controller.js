'use strict';

angular.module('cardsApp')
  .controller('CrapetteCtrl', function ($scope, cards) {
  	$scope.deck = cards.createDeck();
  	$scope.cards = cards;
  });
