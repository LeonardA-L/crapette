import { Deck } from './deck.model';

export const Spread = {
  LEFT: -1,
  NONE: 0,
  RIGHT: 1
};

export class Stack {
  public deck: Deck;
  public vertical: Boolean;
  public spread: Number;
  public pushRule: Function;
  public popRule: Function;
  public owner;

  constructor(deck, vertical, pushRule, popRule, owner?, spread?) {
    this.deck = deck;
    this.vertical = vertical;
    this.spread = spread;
    this.pushRule = pushRule;
    this.popRule = popRule;
    this.owner = owner;
  }
}
