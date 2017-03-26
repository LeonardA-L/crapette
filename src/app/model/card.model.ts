export const CardType = {
  CLUBS: {
    name: 'clubs'
  },
  HEARTS: {
    name: 'hearts'
  },
  DIAMONDS: {
    name: 'diamonds'
  },
  SPADES: {
    name: 'spades'
  }
};

export class Card {
  public player;
  public type: CardType;
  public value: Number;

  constructor(player, type, value) {
    this.player = player;
    this.type = type;
    this.value = value;

    player.deck.addCard(this);
  }
}
