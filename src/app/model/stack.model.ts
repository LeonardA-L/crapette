import { Deck } from './deck.model';

export const Spread = {
  LEFT: -1,
  NONE: 0,
  RIGHT: 1
};

export const StackTypes = {
  MAIN: 0,
  CRAPETTE: 1,
  DISCARD: 2,
  ACE: 3,
  STREET: 4
};

export class Stack {
  public deck: Deck;
  public vertical: Boolean;
  public spread: Number;
  public pushRule: Function;
  public popRule: Function;
  public owner;
  public type: StackTypes;

  constructor(deck, vertical, pushRule, popRule, owner, type, spread?) {
    this.deck = deck;
    this.vertical = vertical;
    this.spread = spread;
    this.pushRule = pushRule;
    this.popRule = popRule;
    this.owner = owner;
    this.type = type;
  }
}
