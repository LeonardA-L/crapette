// Card tools service

import { Injectable } from '@angular/core';

import { CONFIG } from '../environment';

@Injectable()
export class SettingsService {

  public get rotateBoard() {
    return CONFIG.rotateBoard;
  }

  public set rotateBoard(newValue) {
    CONFIG.rotateBoard = newValue;
  }

}
