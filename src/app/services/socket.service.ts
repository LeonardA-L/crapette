// Socket service

import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  public playerId: Number;
  public gameHash;
  socket: SocketIOClient.Socket;
  private firstConnection = false;

  public init(playerId, hash) {
    console.log('Init Socket Service', playerId, hash);
    this.playerId = parseInt(playerId.match(/\d/)[0], 10);
    this.gameHash = hash;

    this.socket = io.connect('http://localhost:3535');  // TODO config
    this.socket.on("connect", () => this.connect());
    this.socket.on('game', (msg) => this.incomingGame(msg));
    // this.socket.on("disconnect", () => this.disconnect());  // TODO
    this.socket.on("error", (error: string) => {
        console.log(`ERROR: "${error}" (${socketUrl})`);
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

  private incomingGame(game) {
    console.log(game);
  }
}
