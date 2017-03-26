// Card tools service

import { Injectable } from '@angular/core';

import { Card } from './../model/card.model';

@Injectable()
export class CardToolsService {
  public getCharFromNumeric(value: Number): String {
    let name: String = '' + value;
    switch (value) {
      case 11:
        name = 'J';
      break;
      case 12:
        name = 'Q';
      break;
      case 13:
        name = 'K';
      break;
      default:
      break;
    }

    return name;
  }

  public getNumericFromChar(value: String): Number {
    let numeric = parseInt(value, 10);

    switch (value) {
      case 'J':
        numeric = 11;
      break;
      case 'Q':
        numeric = 12;
      break;
      case 'K':
        numeric = 13;
      break;
      default:
      break;
    }

    return numeric;
  }

}
