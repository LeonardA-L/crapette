// Card tools service

import { Injectable } from '@angular/core';
import { Broadcaster } from './broadcast.service';
import { CardToolsService } from './card-tools.service';

import { StackTypes } from './../model/stack.model';

@Injectable()
export class AnimationService {

  constructor(
    private broadcaster: Broadcaster,
    private cardTools: CardToolsService,
  ) {}

  public init() {
    this.broadcaster.on<string>('postCardPush').subscribe(this.onPostCardPush);
  }

  private onPostCardPush(event) {
    const stack = event.stack;
    if (stack.type === StackTypes.ACE && stack.deck.cards.length === cardTools.CARDMAXHIGH) {
      console.log('OKKKK', stack.deck.cards.length)
    }
  }
}
