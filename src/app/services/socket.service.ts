// Socket service

import { Injectable } from '@angular/core';
import { CrapetteService } from './crapette.service';
import { Broadcaster } from './broadcast.service';

import { AppState } from '../app.service';

import { Card, CardType } from '../model/card.model';

import { CONFIG } from '../environment';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  public playerId: Number;
  public gameHash;
  public isMultiGame = false;
  public protocol;
  public firstConnection = false;
  private socket;
  private crapette;

  constructor(
    public appState: AppState,
    private broadcaster: Broadcaster,
  ) {}

  public init(playerId, hash, crapetteService) {
    this.crapette = crapetteService;
    console.log('Init Socket Service', playerId, hash);
    this.playerId = parseInt(playerId.match(/\d/)[0], 10) - 1;
    this.gameHash = hash;
    this.isMultiGame = true;

    const socketUrl = CONFIG.multiServerUrl;
    this.socket = io.connect(socketUrl);
    this.socket.on('connect', () => this.connect());
    this.socket.on('game', (msg) => this.incomingGame(msg));
    this.socket.on('game:pick', (msg) => this.incomingPick(msg));
    this.socket.on('game:push', (msg) => this.incomingPush(msg));
    this.socket.on('game:refillMain', (msg) => this.incomingRefill(msg));
    this.socket.on('game:crapette', (msg) => this.incomingCrapette(msg));
    // this.socket.on('disconnect', () => this.disconnect());  // TODO
    this.socket.on('error', (error: string) => {
        console.log('ERROR', error, socketUrl);
    });
    this.protocol = window.location.protocol;
  }

  public syncPick(stack) {
    this.sendMessage('game:pick', {
      stack: stack.name
    });
  }

  public syncPush(stackFrom, stackTo) {
    this.sendMessage('game:push', {
      stackFrom: stackFrom.name,
      stackTo: stackTo.name
    });
  }

  public syncTurn(player) {
    this.sendMessage('game:turn', {
      player: player.id
    });
  }

  public syncWinner(player) {
    this.sendMessage('game:winner', {
      player: player.id
    });
  }

  public syncRefillMain(player) {
    this.sendMessage('game:refillMain', {
      player: player.id
    });
  }

  public syncCrapette(player) {
    this.sendMessage('game:crapette', {
      player
    });
  }

  private connect() {
    const service = this;
    if (!this.firstConnection) {
      this.sendMessage('game:start', {
        player: this.playerId,
      });
    }
    this.firstConnection = true;
  };

  private dealStack(from, to, players, name) {
    for (let c of from) {
      to.deck.addCard(new Card(players[c.player], CardType[c.type], c.value, c.visible));
    }
    to.name = name;
    return to;
  }

  private dealStackByName(name, stacks, serializedGame, players) {
    const from = serializedGame[name];
    const to = stacks[name];

    return this.dealStack(from, to, players, name);
  }

  private incomingGame(game) {
    console.log(game);
    const players = this.crapette.initPlayersWithoutCards();
    const stacks = this.crapette.initStacks(players);
    const stacksByName = {};

    stacksByName['player' + 0 + 'Crapette'] = this.dealStackByName('player' + 0 + 'Crapette', stacks, game, players);
    stacksByName['player' + 0 + 'Main'] = this.dealStackByName('player' + 0 + 'Main', stacks, game, players);
    stacksByName['player' + 0 + 'Discard'] = this.dealStackByName('player' + 0 + 'Discard', stacks, game, players);

    stacksByName['player' + 1 + 'Crapette'] = this.dealStackByName('player' + 1 + 'Crapette', stacks, game, players);
    stacksByName['player' + 1 + 'Main'] = this.dealStackByName('player' + 1 + 'Main', stacks, game, players);
    stacksByName['player' + 1 + 'Discard'] = this.dealStackByName('player' + 1 + 'Discard', stacks, game, players);

    for (let i = 0; i < game.aces.length; i++) {
      stacksByName['ace-' + i] = this.dealStack(game.aces[i], stacks.aces[i], players, 'ace-' + i);
    }

    for (let i = 0; i < game.streets.length; i++) {
      stacksByName['street-' + i] = this.dealStack(game.streets[i], stacks.streets[i], players, 'street-' + i);
    }

    if (game.winner >= 0) {
      const winner = players[game.winner];
      this.crapette.winner = winner;
    }
    console.log(game.starter, players[game.starter]);

    this.broadcaster.broadcast('newGame', {
      stacks,
      players,
      starter: players[game.starter],
      stacksByName
    });
  }

  private incomingPick(message) {
    if (message.emitter === this.playerId) {
      return;
    }
    const stacks = this.appState.get('stacksByName');
    this.crapette.pick(stacks[message.stack]);
  }

  private incomingPush(message) {
    if (message.emitter === this.playerId) {
      return;
    }
    const stacks = this.appState.get('stacksByName');
    this.crapette.push(stacks[message.stackTo]);
  }

  private incomingRefill(message) {
    if (message.emitter === this.playerId) {
      return;
    }
    const players = this.appState.get('players');
    this.crapette.refillMain(players[message.player]);
  }

  private incomingCrapette(message) {
    if (message.emitter === this.playerId) {
      return;
    }
    const player = message.player;
    this.broadcaster.broadcast('clickCrapette', message);
  }

  private sendMessage(event, msg) {
    msg.hash = this.gameHash;
    msg.emitter = this.playerId;
    this.socket.emit(event, msg);
  }
}
