import { Card } from './card.model';

export class Deck {
  public cards: Card[];

  constructor(cards?) {
    this.cards = [];
    if (cards) {
      this.cards.push(...cards);
    }
  }

  public addCard(card: Card) {
    this.cards.push(card);
  }

  public pop() {
    return this.cards.pop();
  }

  public get last(): Card {
    return this.cards[this.cards.length - 1];
  }
}
