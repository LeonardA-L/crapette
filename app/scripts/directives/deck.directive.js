'use strict';

angular.module('cardsDirectives', [])
.directive('deck', function(cards) {
  return {
  	restrict: 'E',
    templateUrl: 'views/directives/deck.view.html',
    scope: {
    	deck: '=',
      rotate: '='
    },
    link: function(scope){
    	scope.cards = cards;
    }
  };
});