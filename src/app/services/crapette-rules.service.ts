// Rules managing the right to move cards between stacks

import { Injectable } from '@angular/core';

import { Card, CardType } from './../model/card.model';
import { Deck } from './../model/deck.model';
import { Stack, Spread } from './../model/stack.model';
import { Player } from './../model/player.model';

import { CardToolsService } from './card-tools.service';

@Injectable()
export class RulesService {
  public simpleRule() {
    return true;
  }
}
