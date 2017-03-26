import { Deck } from './deck.model';

export class Player {
  public id: Number;
  public deck: Deck;

  constructor(id) {
    this.id = id;
    this.deck = new Deck();
  }
}
