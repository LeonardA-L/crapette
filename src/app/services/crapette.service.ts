// Crapette game service

import { Injectable } from '@angular/core';

import { Card, CardType } from './../model/card.model';
import { Deck } from './../model/deck.model';
import { Stack, Spread } from './../model/stack.model';
import { Player } from './../model/player.model';

import { CardToolsService } from './card-tools.service';
import { RulesService } from './crapette-rules.service';

@Injectable()
export class CrapetteService {
  public NUMBEROFSTREETS = 4;  // Per player
  public CRAPETTEHIGH = 13;
  public currentPlayer: Player;
  public pickedCard: Card;
  public pickedStack: Stack;

  constructor(
    public cardToolsService: CardToolsService,
    public rulesService: RulesService,
  ) {}

  public initPlayers() {
    let player0 = this.initPlayer(0);
    let player1 = this.initPlayer(1);
    this.currentPlayer = player0;
    return [player0, player1];
  }

  public initStacks(players) {
    let stacks = {
      player0Main : new Stack(players[0].deck, false,
        this.rulesService.simpleRule, this.rulesService.simpleRule,
        players[0], Spread.NONE),
      player0Discard : new Stack(new Deck(), false,
        this.rulesService.simpleRule, this.rulesService.simpleRule,
        players[0], Spread.NONE),
      player0Crapette : new Stack(new Deck(), true,
        this.rulesService.simpleRule, this.rulesService.simpleRule,
        players[0], Spread.NONE),

      player1Main : new Stack(players[1].deck, false,
        this.rulesService.simpleRule, this.rulesService.simpleRule,
        players[1], Spread.NONE),
      player1Discard : new Stack(new Deck(), false,
        this.rulesService.simpleRule, this.rulesService.simpleRule,
        players[1], Spread.NONE),
      player1Crapette : new Stack(new Deck(), true,
        this.rulesService.simpleRule, this.rulesService.simpleRule,
        players[1], Spread.NONE),

      aces : [],
      streets : []
    };

    for (let p of players) {
      for (let typeName in CardType) {
        if (CardType.hasOwnProperty(typeName)) {
          const type = CardType[typeName];
          stacks.aces.push(new Stack(new Deck(), true,
            this.rulesService.simpleRule, this.rulesService.simpleRule,
            null, Spread.NONE));
        }
      }
    }

    for (let s = 0; s < this.NUMBEROFSTREETS * players.length; s++) {
      stacks.streets.push(new Stack(new Deck(), true,
        this.rulesService.simpleRule, this.rulesService.simpleRule,
        null, Spread.NONE));
    }

    return stacks;
  }

  public dealStacks(stacks, players) {
    for (let p of players) {
      const main = stacks['player' + p.id + 'Main'];
      const crapette = stacks['player' + p.id + 'Crapette'];

      for (let i = 0; i < this.CRAPETTEHIGH; i++) {
        const card = main.deck.pop();
        crapette.deck.addCard(card);
      }

      for (let s = 0; s < this.NUMBEROFSTREETS; s++) {
        const card = main.deck.pop();
        stacks.streets[p.id * this.NUMBEROFSTREETS + s].deck.addCard(card);
      }
    }
  }

  public pick(stackFrom: Stack) {
    this.pickedCard = stackFrom.deck.cards[stackFrom.deck.cards.length - 1];
    this.pickedCard.picked = true;
    this.pickedStack = stackFrom;
  }

  public push(stackTo: Stack) {
    this.pickedStack.deck.pop();
    this.pickedCard.picked = false;
    stackTo.deck.addCard(this.pickedCard);

    this.pickedCard = null;
    this.pickedStack = null;
  }

  private initPlayer(id) {
    let player = new Player(id);
    const set = this.cardToolsService.createSet(player);

    player.deck.cards = set;

    this.cardToolsService.shuffleDeck(player.deck);

    return player;
  }
}
