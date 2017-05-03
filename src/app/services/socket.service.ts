// Socket service

import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  public playerId: Number;
  public gameHash;

  public init(playerId, hash) {
    console.log('Init Socket Service', playerId, hash);
    this.playerId = parseInt(playerId.match(/\d/)[0], 10);
    this.gameHash = hash;
  }
}
