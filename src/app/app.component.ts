/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

import { Player } from './model/player.model';
import { Deck } from './model/deck.model';
import { Stack, StackTypes } from './model/stack.model';
import { CardType, Card } from './model/card.model';

import { CardToolsService } from './services/card-tools.service';
import { CrapetteService } from './services/crapette.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app.html',
  styleUrls: ['app.scss'],
  providers: [CardToolsService, CrapetteService]
})
export class AppComponent implements OnInit {
  public stacks;

  constructor(
    public appState: AppState,
    public cardToolsService: CardToolsService,
    public crapetteService: CrapetteService,
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);

    let players = this.crapetteService.initPlayers();

    this.stacks = this.crapetteService.initStacks(players);
    this.crapetteService.dealStacks(this.stacks, players);

    this.appState.set('stacks', this.stacks);
    this.appState.set('players', players);

    const player0CrapetteCard: Card = this.stacks.player0Crapette.top;
    const player1CrapetteCard: Card = this.stacks.player1Crapette.top;

    let firstPlayerId = player1CrapetteCard.value > player0CrapetteCard.value ? 1 : 0;

    this.appState.set('currentPlayer', players[firstPlayerId]);
  }

  public pick(event) {
    this.crapetteService.pick(event.stack);
  }

  public push(event) {
    const player = this.appState.get('currentPlayer');
    const aceOpportunities: Card[] = this.crapetteService.countAceOpportunity(player);

    const stackFrom = event.stack;
    const stackTo = this.crapetteService.pickedStack;
    this.crapetteService.push(stackFrom);

    const newAceOpportunities: Card[] = this.crapetteService.countAceOpportunity(player);

    // Check for Crapette
    this.checkCrapette(aceOpportunities, newAceOpportunities);

    // Check for end of game
    this.checkVictory(player);

    // Check for end of turn
    this.checkEndTurn(stackFrom, stackTo);
  }

  public crapette(playerId: number) {
    // Get the other player
    const player = this.appState.get('players')[(playerId + 1) % 2];
    if (player !== this.appState.get('currentPlayer')) {
      return;
    }

    if (this.crapetteService.crapetteAvailable) {
      console.log('CRAPETTE');
      this.crapetteService.endTurn();
    }
  }

  public changePlayer() {
    this.crapetteService.endTurn();
  }

  private checkCrapette(aceOpportunities: Card[], newAceOpportunities: Card[]) {
    if (aceOpportunities.length > 0 && newAceOpportunities.length === aceOpportunities.length) {
      // Need to check that every opportunity is the same because solving one may have created another
      let same = true;
      for (let i = 0; i < aceOpportunities.length; i++) {
        const cardOld = aceOpportunities[i];
        const cardNew = newAceOpportunities[i];

        if (cardOld !== cardNew) {
          same = false;
          break;
        }
      }
      this.crapetteService.crapetteAvailable = same;
    } else {
      this.crapetteService.crapetteAvailable = false;
    }
  }

  private checkVictory(player: Player) {
    const crapette: Stack = this.stacks['player' + player.id + 'Crapette'];
    const main: Stack = this.stacks['player' + player.id + 'Main'];
    const discard: Stack = this.stacks['player' + player.id + 'Discard'];

    if (crapette.isEmpty() && main.isEmpty() && discard.isEmpty()) {
      console.log('Player', player.id, 'wins');
    }
  }

  private checkEndTurn(stackFrom: Stack, stackTo: Stack) {
    if (stackFrom.type === StackTypes.DISCARD
      && stackFrom !== stackTo
      && stackFrom.owner && stackFrom.owner.id === this.appState.get('currentPlayer').id) {
      this.crapetteService.endTurn();
    }
  }

}
