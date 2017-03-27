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
    this.appState.set('currentPlayer', players[0]);
  }

  public pick(event) {
    this.crapetteService.pick(event.stack);
  }

  public push(event) {
    this.crapetteService.push(event.stack);

    if (event.stack.type === StackTypes.DISCARD
      && event.stack.owner && event.stack.owner.id === this.appState.get('currentPlayer').id) {
      this.crapetteService.endTurn();
    }
  }

  public changePlayer() {
    this.crapetteService.endTurn();
  }

}
