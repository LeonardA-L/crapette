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
    if (routeParams.seed && routeParams.player) {
      this.together.init(routeParams);
      this.hub = false;
      this.socketService.init(routeParams.player, routeParams.seed);
      this.crapetteService.lockRotate = this.socketService.playerId === 0;
    } else {
      let players = this.crapetteService.initPlayers();

      const stacks = this.crapetteService.initStacks(players);
      this.crapetteService.dealStacks(stacks, players);
      this.startGame(stacks, players);
    }

    this.animationService.init();

    const service = this;
    this.broadcaster.on<any>('newGame').subscribe((event) => service.startGame(event.stacks, event.players));

  }

  public startGame(stacks, players) {
    this.stacks = stacks;
    this.appState.set('stacks', this.stacks);
    this.appState.set('players', players);

    const player0CrapetteCard: Card = this.stacks.player0Crapette.top;
    const player1CrapetteCard: Card = this.stacks.player1Crapette.top;

    let firstPlayerId = player1CrapetteCard.value > player0CrapetteCard.value ? 1 : 0;

    this.appState.set('currentPlayer', players[firstPlayerId]);
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
      this.broadcaster.broadcast('crapette');
      setTimeout(() => {
        this.crapetteService.endTurn();
      }, 1700);
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
      this.crapetteService.winner = player;
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
