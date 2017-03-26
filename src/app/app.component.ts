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
import { Stack } from './model/stack.model';
import { CardType, Card } from './model/card.model';

import { CardToolsService } from './services/card-tools.service';
import { CrapetteService } from './services/crapette.service';
import { RulesService } from './services/crapette-rules.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app.html',
  styleUrls: ['app.scss'],
  providers: [CardToolsService, CrapetteService, RulesService]
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
    console.log(players);

    this.stacks = this.crapetteService.initStacks(players);
    this.crapetteService.dealStacks(this.stacks, players);
    console.log(this.stacks);
  }

  public pick(event) {
    this.crapetteService.pick(event.stack);
  }

  public push(event) {
    this.crapetteService.push(event.stack);
  }

}
