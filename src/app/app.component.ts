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
import { CardType, Card } from './model/card.model';

import { CardToolsService } from './services/card-tools.service';  // Get the model

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app.html',
  providers: [CardToolsService]
})
export class AppComponent implements OnInit {
  public card;

  constructor(
    public appState: AppState,
    public cardToolsService: CardToolsService
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
  }

}
