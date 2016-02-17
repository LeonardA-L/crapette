'use strict';

angular.module('cardsApp')
  .controller('CrapetteCtrl', function ($scope, cards) {
  	//$scope.deck = cards.createDeck();
  	$scope.cards = cards;

  	$scope.game = {};

  	// It's crapette time
	var NSLOTS = 8, NSTACKS = cards.CARDTYPES.length * 2, SIZECRAPETTE = 14;

	$scope.game.slots = [];
	for(var i=0;i<NSLOTS; i++){
		$scope.game.slots.push([]);
	}

	$scope.game.aceStacks = [];
	for(var i=0;i<NSTACKS; i++){
		$scope.game.aceStacks.push([]);
	}

	function initCrapettePlayer(playerId, _game){
		var player = cards.createDeck();
		for(var i=0; i < player.length; i++){
			player[i].player = playerId;
		}

		var playerDeck = cards.copyDeckDeep(player).shuffle();
		var playerCrapette = [];

		// Fill crapette
		for(var i = 0; i < SIZECRAPETTE; i++){
			playerCrapette.push(playerDeck.pop());
		}
		playerCrapette[playerCrapette.length - 1].turned = true;

		// Fill slots
		for(var i=playerId*NSLOTS/2; i<(playerId+1)*NSLOTS/2; i++){
			_game.slots[i].push(playerDeck.pop());
		}

		return {
			id: playerId,
			refs: player,
			deck: playerDeck,
			crapette: playerCrapette,
			discard: []
		}
	}

	$scope.game.players = [];
	$scope.game.players.push(initCrapettePlayer(0, $scope.game));
	$scope.game.players.push(initCrapettePlayer(1, $scope.game));
});
