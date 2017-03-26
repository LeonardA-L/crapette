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

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app.html'
})
export class AppComponent implements OnInit {
  public card;

  constructor(
    public appState: AppState
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);

    let player = new Player(0);
    console.log(player);
    this.card = new Card(player, CardType.CLUBS, 6);
    let deck = new Deck([this.card]);
    console.log(deck);
  }

}
