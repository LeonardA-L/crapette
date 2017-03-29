// Crapette game service

import { Injectable } from '@angular/core';

import { Card, CardType } from './../model/card.model';
import { Deck } from './../model/deck.model';
import { Stack, Spread, StackTypes } from './../model/stack.model';
import { Player } from './../model/player.model';

import { CardToolsService } from './card-tools.service';
import * as Rules from './../model/rules.model';

import { AppState } from './../app.service';

@Injectable()
export class CrapetteService {
  public NUMBEROFSTREETS = 4;  // Per player
  public CRAPETTEHIGH = 13;
  public pickedCard: Card;
  public pickedStack: Stack;
  public crapetteAvailable = false;

  constructor(
    public cardToolsService: CardToolsService,
    public appState: AppState,
  ) {}

  public initPlayers() {
    let player0 = this.initPlayer(0);
    let player1 = this.initPlayer(1);
    return [player0, player1];
  }

  public initStacks(players) {
    let stacks = {
      player0Main : new Stack(players[0].deck, false,
        Rules.pushNever, Rules.pickupOwner,
        players[0], StackTypes.MAIN, false, Spread.NONE),
      player0Discard : new Stack(new Deck(), false,
        Rules.pushDiscard, Rules.pickupDiscard,
        players[0], StackTypes.DISCARD, true, Spread.NONE),
      player0Crapette : new Stack(new Deck(), true,
        Rules.pushCrapette, Rules.pickupOwner,
        players[0], StackTypes.CRAPETTE, true, Spread.NONE),

      player1Main : new Stack(players[1].deck, false,
        Rules.pushNever, Rules.pickupOwner,
        players[1], StackTypes.MAIN, false, Spread.NONE),
      player1Discard : new Stack(new Deck(), false,
        Rules.pushDiscard, Rules.pickupDiscard,
        players[1], StackTypes.DISCARD, true, Spread.NONE),
      player1Crapette : new Stack(new Deck(), true,
        Rules.pushCrapette, Rules.pickupOwner,
        players[1], StackTypes.CRAPETTE, true, Spread.NONE),

      aces : [],
      streets : []
    };

    for (let p of players) {
      for (let typeName in CardType) {
        if (CardType.hasOwnProperty(typeName)) {
          const type = CardType[typeName];
          stacks.aces.push(new Stack(new Deck(), true,
            Rules.pushAces, Rules.pickupNever,
            null, StackTypes.ACE, true, Spread.NONE));
        }
      }
    }

    for (let s = 0; s < this.NUMBEROFSTREETS * players.length; s++) {
      stacks.streets.push(new Stack(new Deck(), true,
        Rules.pushStreets, Rules.pickupAlways,
        null, StackTypes.STREET, true, s < this.NUMBEROFSTREETS ? Spread.LEFT : Spread.RIGHT));
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
      crapette.deck.cards[crapette.deck.cards.length - 1].visible = true;

      for (let s = 0; s < this.NUMBEROFSTREETS; s++) {
        const card = main.deck.pop();
        card.visible = true;
        stacks.streets[p.id * this.NUMBEROFSTREETS + s].deck.addCard(card);
      }
    }
  }

  public pick(stackFrom: Stack) {
    this.pickedCard = stackFrom.deck.cards[stackFrom.deck.cards.length - 1];
    this.pickedCard.picked = true;
    this.pickedCard.visible = true;
    this.pickedStack = stackFrom;
  }

  public push(stackTo: Stack) {
    this.pickedStack.deck.pop();
    this.pickedCard.picked = false;
    stackTo.deck.addCard(this.pickedCard);

    this.pickedCard = null;
    this.pickedStack = null;
  }

  public endTurn() {
    const currentPlayer = this.appState.get('currentPlayer');
    // uncover top card on the crapette
    const crapette = this.appState.get('stacks')['player' + currentPlayer.id + 'Crapette'];
    const lastCard = crapette.deck.cards[crapette.deck.cards.length - 1];
    if (lastCard) {
      lastCard.visible = true;
    }

    // change current player
    const nextPlayer: Player = this.appState.get('players')
      [(currentPlayer.id + 1) % 2];
    this.appState.set('currentPlayer', nextPlayer);

    // Reset temporary states

    // Discard card that is picked from main
    if (this.pickedCard && this.pickedStack && this.pickedStack.type === StackTypes.MAIN) {
      const discard = this.appState.get('stacks')['player' + currentPlayer.id + 'Discard'];
      this.push(discard);
    }

    if (this.pickedStack) {
      this.pickedStack = null;
    }
    if (this.pickedCard) {
      this.pickedCard.picked = false;
      this.pickedCard = null;
    }

    // Reset crapette! state
    this.crapetteAvailable = false;
  }

  public refillMain(player: Player) {
    const stacks = this.appState.get('stacks');
    const main = stacks['player' + player.id + 'Main'];
    const discard = stacks['player' + player.id + 'Discard'];

    main.deck.cards = discard.deck.cards.reverse();
    discard.deck.cards = [];

    main.deck.cards.forEach((c) => c.visible = false);
  }

  public countAceOpportunity(player: Player) {
      let stacksToInspect: Stack[] = [];
      const stacks = this.appState.get('stacks');
      stacksToInspect.push(stacks['player' + player.id + 'Main']);
      stacksToInspect.push(stacks['player' + player.id + 'Crapette']);
      stacksToInspect.push(stacks['player' + player.id + 'Discard']);

      stacksToInspect.push(...stacks.streets);

      let opportunities = 0;

      // GOOD OL' O(N*P)
      for (let stack of stacksToInspect) {
        const card: Card = stack.deck.cards[stack.deck.cards.length - 1];
        if (card && stack.popRule(stack, card, this.appState, player)) {
          for (let aceStack of stacks.aces) {
            if (aceStack.pushRule(aceStack, card, this.appState, player, stack)) {
              opportunities ++;
            }
          }
        }
      }

      return opportunities;
  }

  private initPlayer(id) {
    let player = new Player(id);
    const set = this.cardToolsService.createSet(player);

    player.deck.cards = set;

    this.cardToolsService.shuffleDeck(player.deck);

    return player;
  }
}
