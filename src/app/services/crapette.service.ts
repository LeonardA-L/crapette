// Crapette tools service

import { Injectable } from '@angular/core';

import { Card, CardType } from './../model/card.model';
import { Deck } from './../model/deck.model';
import { Stack, Spread } from './../model/stack.model';
import { Player } from './../model/player.model';

import { CardToolsService } from './card-tools.service';

@Injectable()
export class CrapetteService {
  public NUMBEROFSTREETS = 8;

  constructor(
    public cardToolsService: CardToolsService,
  ) {}

  public initPlayers() {
    return [this.initPlayer(0), this.initPlayer(1)];
  }

  public initStacks(players) {
    let stacks = {
      player0Main : new Stack(players[0].deck, false, null, null, Spread.NONE),
      player0Discard : new Stack(new Deck(), false, null, null, Spread.NONE),
      player0Crapette : new Stack(new Deck(), true, null, null, Spread.NONE),

      player1Main : new Stack(players[1].deck, false, null, null, Spread.NONE),
      player1Discard : new Stack(new Deck(), false, null, null, Spread.NONE),
      player1Crapette : new Stack(new Deck(), true, null, null, Spread.NONE),

      aces : [],
      streets : []
    };

    for (let p of players) {
      for (let typeName in CardType) {
        if (CardType.hasOwnProperty(typeName)) {
          const type = CardType[typeName];
          stacks.aces.push(new Stack(new Deck(), true, null, null, Spread.NONE));
        }
      }
    }

    for (let s=0; s<this.NUMBEROFSTREETS; s++) {
      stacks.streets.push(new Stack(new Deck(), true, null, null, Spread.NONE));
    }

    return stacks;
  }

  private initPlayer(id) {
    let player = new Player(id);
    const set = this.cardToolsService.createSet(player);

    player.deck.cards = set;

    this.cardToolsService.shuffleDeck(player.deck);

    return player;
  }
}
