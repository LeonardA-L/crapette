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

  public get stackLength() {
    return CONFIG.stackLength;
  }

  public set stackLength(newValue) {
    CONFIG.stackLength = newValue;
  }

}
