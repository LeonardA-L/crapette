// Socket service

import { Injectable } from '@angular/core';
import { CrapetteService } from './crapette.service';
import { Broadcaster } from './broadcast.service';

import { Card, CardType } from '../model/card.model';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  public playerId: Number;
  public gameHash;
  private socket;
  private firstConnection = false;

  constructor(
    private crapette: CrapetteService,
    private broadcaster: Broadcaster,
  ) {}

  public init(playerId, hash) {
    console.log('Init Socket Service', playerId, hash);
    this.playerId = parseInt(playerId.match(/\d/)[0], 10);
    this.gameHash = hash;

    const socketUrl = 'http://localhost:3535'; // TODO config
    this.socket = io.connect(socketUrl);
    this.socket.on('connect', () => this.connect());
    this.socket.on('game', (msg) => this.incomingGame(msg));
    // this.socket.on('disconnect', () => this.disconnect());  // TODO
    this.socket.on('error', (error: string) => {
        console.log('ERROR', error, socketUrl);
    });
  }

  private connect() {
    const service = this;
    if (!this.firstConnection) {
      this.socket.emit('game:start', {
        player: this.playerId,
        hash: this.gameHash
      });
    }
    this.firstConnection = true;
  };

  private dealStack(from, to, players) {
    for (let c of from) {
      to.deck.addCard(new Card(players[c.player], CardType[c.type], c.value, c.visible));
    }
  }

  private dealStackByName(name, stacks, serializedGame, players) {
    const from = serializedGame[name];
    const to = stacks[name];

    this.dealStack(from, to, players);
  }

  private incomingGame(game) {
    const players = this.crapette.initPlayers();
    const stacks = this.crapette.initStacks(players);

    this.dealStackByName('player' + 0 + 'Crapette', stacks, game, players);
    this.dealStackByName('player' + 0 + 'Main', stacks, game, players);
    this.dealStackByName('player' + 0 + 'Discard', stacks, game, players);

    this.dealStackByName('player' + 1 + 'Crapette', stacks, game, players);
    this.dealStackByName('player' + 1 + 'Main', stacks, game, players);
    this.dealStackByName('player' + 1 + 'Discard', stacks, game, players);

    for (let i = 0; i < game.aces.length; i++) {
      this.dealStack(game.aces[i], stacks.aces[i], players);
    }

    for (let i = 0; i < game.streets.length; i++) {
      this.dealStack(game.streets[i], stacks.streets[i], players);
    }

    this.broadcaster.broadcast('newGame', {
      stacks,
      players
    });
  }
}
