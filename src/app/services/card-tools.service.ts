// Card tools service

import { Injectable } from '@angular/core';

import { Card, CardType } from './../model/card.model';
import { Deck } from './../model/deck.model';

@Injectable()
export class CardToolsService {
  public CARDMINHIGH = 1;    // Ace
  public CARDMAXHIGH = 13; // King

  public getCharFromNumeric(value: Number): string {
    let name: string = '' + value;
    switch (value) {
      case 1:
        name = 'A';
      break;
      case 11:
        name = 'J';
      break;
      case 12:
        name = 'Q';
      break;
      case 13:
        name = 'K';
      break;
      default:
      break;
    }

    return name;
  }

  public getNumericFromChar(value: string): Number {
    let numeric = parseInt(value, 10);

    switch (value) {
      case 'A':
        numeric = 1;
      break;
      case 'J':
        numeric = 11;
      break;
      case 'Q':
        numeric = 12;
      break;
      case 'K':
        numeric = 13;
      break;
      default:
      break;
    }

    return numeric;
  }

  public shuffleDeck(deck: Deck) {
    deck.cards = this.shuffle(deck.cards);
  }

  public createSet (player, cardMinHigh?, cardMaxHigh?) {
    let cards: Card[] = [];
    cardMinHigh = cardMinHigh || this.CARDMINHIGH;
    cardMaxHigh = cardMaxHigh || this.CARDMAXHIGH;
    for (let typeName in CardType) {
      if (CardType.hasOwnProperty(typeName)) {
        const type = CardType[typeName];
        for (let i = cardMinHigh; i <= cardMaxHigh; i++) {
          cards.push(new Card(player, type, i));
        }
      }
    }
    return cards;
  }

  // -> Fisher–Yates shuffle algorithm
  private shuffle(arr) {
    let m = arr.length;
    let t;
    let i;

    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = arr[m];
      arr[m] = arr[i];
      arr[i] = t;
    }

    return arr;
  }

}
