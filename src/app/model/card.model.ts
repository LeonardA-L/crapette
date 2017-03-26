export const CardType = {
  CLUBS: {
    name: 'clubs',
    color: 0
  },
  HEARTS: {
    name: 'hearts',
    color: 1
  },
  DIAMONDS: {
    name: 'diamonds',
    color: 1
  },
  SPADES: {
    name: 'spades',
    color: 0
  }
};

export class Card {
  public player;
  public type: CardType;
  public value: Number;
  public visible: Boolean;
  public picked: Boolean;
  public stack;

  constructor(player, type, value) {
    if (player) {
      this.player = player;
    }
    this.type = type;
    this.value = value;
    this.visible = false;
    this.picked = false;

    player.deck.addCard(this);
  }
}
