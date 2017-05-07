/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';

import { AppState } from '../../app.service';

import { Player } from '../../model/player.model';
import { Deck } from '../../model/deck.model';
import { Stack, StackTypes } from '../../model/stack.model';
import { CardType, Card } from '../../model/card.model';

import { CardToolsService } from '../../services/card-tools.service';
import { CrapetteService } from '../../services/crapette.service';
import { SettingsService } from '../../services/settings.service';
import { TogetherService } from '../../services/together.service';
import { AnimationService } from '../../services/animation.service';
import { Broadcaster } from '../../services/broadcast.service';
import { SocketService } from '../../services/socket.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'game',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'game.html',
  styleUrls: ['game.scss'],
  providers: [CardToolsService, CrapetteService, SettingsService, TogetherService, AnimationService, SocketService],
  animations: [
    trigger(
      'hubFade',
      [
        transition(
        ':enter', [
          style({opacity: 0}),
          animate('300ms', style({opacity: 1}))
        ]
      ),
      transition(
        ':leave', [
          style({opacity: 1}),
          animate('300ms', style({opacity: 0}))
        ]
      )]
    )
  ],
})
export class GameComponent implements OnInit {
  public stacks;
  public hub = true;

  constructor(
    public appState: AppState,
    public cardToolsService: CardToolsService,
    public crapetteService: CrapetteService,
    public settingsService: SettingsService,
    public animationService: AnimationService,
    public together: TogetherService,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private socketService: SocketService,
  ) {}

  public ngOnInit() {
    const routeParams = this.route.snapshot.params;
    console.log(routeParams)
    if (routeParams.seed && routeParams.player) {
      this.together.init(routeParams);
      this.hub = false;
      this.socketService.init(routeParams.player, routeParams.seed, this.crapetteService);
      this.crapetteService.lockRotate = this.socketService.playerId === 0;
    } else {
      let players = this.crapetteService.initPlayers();

      const stacks = this.crapetteService.initStacks(players);
      this.crapetteService.dealStacks(stacks, players);

      const player0CrapetteCard: Card = stacks.player0Crapette.top;
      const player1CrapetteCard: Card = stacks.player1Crapette.top;

      let firstPlayerId = player1CrapetteCard.value > player0CrapetteCard.value ? 1 : 0;
      const starter = players[firstPlayerId];

      this.startGame(stacks, players, starter);
    }

    this.animationService.init();

    const service = this;
    this.broadcaster.on<any>('newGame').subscribe((event) => service.startGame(event.stacks, event.players, event.starter, event.stacksByName));

    this.broadcaster.on<any>('clickCrapette').subscribe((event) => service.crapette(event.player));
  }

  public startGame(stacks, players, starter, stacksByName?) {
    this.stacks = stacks;
    this.appState.set('stacks', this.stacks);
    this.appState.set('players', players);
    this.appState.set('currentPlayer', starter);
    this.appState.set('stacksByName', stacksByName);
  }

  public pick(event) {
    const player = this.appState.get('currentPlayer');
    if (this.socketService.playerId >= 0 && this.socketService.playerId !== player.id) {
      return;
    }
    this.crapetteService.pick(event.stack);
  }

  public push(event) {
    const player = this.appState.get('currentPlayer');
    if (this.socketService.playerId >= 0 && this.socketService.playerId !== player.id) {
      return;
    }

    const stackTo = event.stack;
    this.crapetteService.push(stackTo);
  }

  public crapette(playerId: number) {
    // Get the other player
    const player = this.appState.get('players')[(playerId + 1) % 2];
    if (player !== this.appState.get('currentPlayer')) {
      return;
    }

    if (this.crapetteService.crapetteAvailable) {
      this.broadcaster.broadcast('crapette');
      let delay = 1700;
      if (this.socketService.isMultiGame && this.socketService.playerId === playerId) {
        this.socketService.syncCrapette(playerId);
        delay += 200;
      }
      setTimeout(() => {
        this.crapetteService.endTurn();
      }, delay);
    } else {
      this.broadcaster.broadcast('noCrapette', {playerId});
    }
  }

  public changePlayer() {
    this.crapetteService.endTurn();
  }

  public startLocalGame() {
    this.hub = false;
  }

}
