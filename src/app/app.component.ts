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

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app.html',
  providers: [CardToolsService, CrapetteService]
})
export class AppComponent implements OnInit {
  public card;
  public stack;

  constructor(
    public appState: AppState,
    public cardToolsService: CardToolsService,
    public crapetteService: CrapetteService,
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);

    let player = new Player(0);
    console.log(player);
    this.card = new Card(player, CardType.CLUBS, 12);
    const set = this.cardToolsService.createSet(player);
    let deck = new Deck(set);
    console.log(deck);
    this.cardToolsService.shuffleDeck(deck);

    this.stack = new Stack(deck, true);

    let players = this.crapetteService.initPlayers();
    console.log(players);

    let stacks = this.crapetteService.initStacks(players);
    console.log(stacks);
  }

}
