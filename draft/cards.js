var CARDTYPES = [
			{
				id:0,
				name:'Coeur',
				color:0
			},
			{
				id:1,
				name:'Carreau',
				color:0
			},
			{
				id:2,
				name:'Trefle',
				color:1
			},
			{
				id:3,
				name:'Pique',
				color:1
			}
			];
var CARDMINHIGH = 1;		// Ace
var CARDMAXHIGH = 13;		// King

var game = {};

function cardNamePrint (_c) {
	if(!_c){
		return '';
	}
	var name = '';
	switch(_c.value){
		case 1:
			name += 'As';
		break;
		case 11:
			name += 'Valet';
		break;
		case 12:
			name += 'Dame';
		break;
		case 13:
			name += 'Roi';
		break;
		default:
			name += _c.value;
		break;
	}

	name += ' de '+_c.type.name;

	return name;
}

function createDeck (cardTypes, cardMinHigh, cardMaxHigh){
	var _cards = [];
	for(var i=0;i<cardTypes.length;i++){
		for (var j = cardMinHigh; j <= cardMaxHigh; j++) {
			_cards.push({
				value:j,
				type:cardTypes[i]
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
			type: c.type
		});
	}
	return _newDeck;
}

/*
var cards = createDeck(CARDTYPES, CARDMINHIGH, CARDMAXHIGH);
var newDeck = copyDeckDeep(cards);
console.log(newDeck[0], cards[0]);
newDeck[0].value=42;
console.log(newDeck[0], cards[0]);
*/
/*
var cards = createDeck(CARDTYPES, CARDMINHIGH, CARDMAXHIGH).shuffle();
console.log(cards);

var deck = copyDeckDeep(cards);

var stack1 = [];
var stack2 = [];

while(deck.length){
	stack1.push(deck.pop());
	if(deck.length)
		stack2.push(deck.pop());
}

console.log(deck.length, stack1.length, stack2.length);
*/

// It's crapette time
var NSLOTS = 8, NSTACKS = CARDTYPES.length * 2, SIZECRAPETTE = 14;

game.slots = [];
for(var i=0;i<NSLOTS; i++){
	game.slots.push([]);
}

game.aceStacks = [];
for(var i=0;i<NSTACKS; i++){
	game.aceStacks.push([]);
}

function initCrapettePlayer(playerId, _game){
	var player = createDeck(CARDTYPES, CARDMINHIGH, CARDMAXHIGH);
	var playerDeck = copyDeckDeep(player).shuffle();
	var playerCrapette = [];

	// Fill crapette
	for(var i = 0; i < SIZECRAPETTE; i++){
		playerCrapette.push(playerDeck.pop());
	}
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

game.players = [];
game.players.push(initCrapettePlayer(0, game));
game.players.push(initCrapettePlayer(1, game));


function printSlots (_game) {
	for(var i=0;i<NSLOTS; i++){
		var s = _game.slots[i];
		console.log('Slot '+i);
		for(var j=0; j<s.length;j++){
			console.log(cardNamePrint(s[j]));
		}
	}
}

function printAceStacks (_game) {
	for(var i=0;i<NSTACKS; i++){
		var s = _game.aceStacks[i];
		console.log('AceStack '+i);
		for(var j=0; j<s.length;j++){
			console.log(cardNamePrint(s[j]));
		}
	}
}

function rule_toSlot (playerCard, slot){
	var slotCard = slot[slot.length - 1];

	var ruleResult = !slotCard || (playerCard && slotCard && playerCard.type.color !== slotCard.type.color && playerCard.value === slotCard.value-1);

	console.log('Attempt to move '+cardNamePrint(playerCard)+' to slot with '+cardNamePrint(slotCard)+' : '+ruleResult, playerCard, slotCard);
	return ruleResult;
}

function move_toSlot (player, pileName, slotId, _game) {
	if(!player[pileName].length){
		return; // UI should not happen
	}
	if(!rule_toSlot(player[pileName][player[pileName].length - 1], _game.slots[slotId])){
		return;	// TODO error
	}
	var c = player[pileName].pop();
	_game.slots[slotId].push(c);
}

function move_crapetteToSlot (player, slotId, _game) {
	move_toSlot(player, 'crapette', slotId, _game);
}

function move_deckToSlot(player, slotId, _game){
	move_toSlot(player, 'deck', slotId, _game);
}

function rule_toAceStack (playerCard, aceStack) {
	var aceStackCard = aceStack[aceStack.length - 1];

	var ruleResult = (!aceStackCard && playerCard.value === 1) || (playerCard && aceStackCard && playerCard.type.id === aceStackCard.type.id && playerCard.value === aceStackCard.value + 1);

	console.log('Attempt to move '+cardNamePrint(playerCard)+' to Ace Stack with '+cardNamePrint(aceStackCard)+' : '+ruleResult, playerCard, aceStackCard);
	return ruleResult;
}

function move_toAceStack(player, pileName, aceStackId, _game) {
	if(!player[pileName].length){
		return; // UI should not happen
	}
	if(!rule_toAceStack(player[pileName][player[pileName].length - 1], _game.aceStacks[aceStackId])){
		return;	// TODO error
	}
	var c = player[pileName].pop();
	_game.aceStacks[aceStackId].push(c);
}

function move_crapetteToAceStack(player, aceStackId, _game) {
	move_toAceStack(player, 'crapette', aceStackId, _game);
}

function rule_toDiscard (playerCard, opponentCard) {
	var ruleResult = playerCard && opponentCard && playerCard.type.color !== opponentCard.type.color && (playerCard.value === opponentCard.value + 1 || playerCard.value === opponentCard.value - 1) && /*King*/ opponentCard.value !== CARDMAXHIGH;

	console.log('Attempt to move '+cardNamePrint(playerCard)+' to Opponent Discard with '+cardNamePrint(opponentCard)+' : '+ruleResult, playerCard, opponentCard);
	return ruleResult;
}

function move_crapetteToDiscard(player, opponent) {
	if(player.id === opponent.id){
		return; // UI should not happen
	}
	if(!player.crapette.length){
		return; // UI should not happen
	}
	if(!rule_toDiscard(player.crapette[player.crapette.length - 1], opponent.discard[opponent.discard.length - 1])){
		return;	// TODO error
	}
	var c = player.crapette.pop();
	opponent.discard.push(c);
}

function rule_toCrapette (playerCard, opponentCard) {
	var ruleResult = playerCard && opponentCard && playerCard.type.id === opponentCard.type.id && (playerCard.value === opponentCard.value + 1 || playerCard.value === opponentCard.value - 1) && /*King*/ opponentCard.value !== CARDMAXHIGH;

	console.log('Attempt to move '+cardNamePrint(playerCard)+' to Opponent Crapette with '+cardNamePrint(opponentCard)+' : '+ruleResult, playerCard, opponentCard);
	return ruleResult;
}

function move_crapetteToCrapette(player, opponent) {
	if(player.id === opponent.id){
		return; // UI should not happen
	}
	if(!player.crapette.length){
		return; // UI should not happen
	}
	if(!rule_toCrapette(player.crapette[player.crapette.length - 1], opponent.crapette[opponent.crapette.length - 1])){
		return;	// TODO error
	}
	var c = player.crapette.pop();
	opponent.crapette.push(c);
}

var red = game.players[0];
var blue = game.players[1];


for(var i=0;i<NSLOTS;i++){
	move_crapetteToSlot(red, i, game);
}
/*
red.crapette.push(blue.refs[0]);
move_crapetteToAceStack(red, 0);
move_crapetteToDiscard(red, blue);
move_crapetteToCrapette(red, blue);
*/


console.log(red);
console.log('Red crapette : '+ cardNamePrint(red.crapette[red.crapette.length - 1]));


console.log(red);
console.log(blue);
console.log('Red crapette : '+ cardNamePrint(red.crapette[red.crapette.length - 1]));


console.log('ok');