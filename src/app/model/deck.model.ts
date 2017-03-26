import Card from './card.model';

export class Deck {
  public cards: Card[];

  constructor(cards) {
    this.cards = [];
    this.cards.push(...cards);
  }
}
