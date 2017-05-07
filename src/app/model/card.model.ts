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
  public type;
  public value: number;
  public visible: boolean;
  public picked: boolean;
  public stack;

  public rotation: number;

  constructor(player, type, value, visible?) {
    if (player) {
      this.player = player;
    }
    this.type = type;
    this.value = value;
    this.visible = !!visible;
    this.picked = false;
  }
}
