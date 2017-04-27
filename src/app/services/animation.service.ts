// Card tools service

import { Injectable } from '@angular/core';
import { Broadcaster } from './broadcast.service';
import { CardToolsService } from './card-tools.service';

import { StackTypes } from './../model/stack.model';

import { CONFIG } from '../environment';

@Injectable()
export class AnimationService {

  constructor(
    private broadcaster: Broadcaster,
    private cardTools: CardToolsService,
  ) {}

  public init() {
    const service = this;
    this.broadcaster.on<string>('postCardPush').subscribe((event) => service.onPostCardPush(event));
  }

  private onPostCardPush(event) {
    const stack = event.stack;
    if (stack.type === StackTypes.ACE && stack.deck.cards.length === this.cardTools.CARDMAXHIGH) {
      this.aceStackAnimation(stack, stack.deck.cards.length - 1);
    }
  }

  private aceStackAnimation(stack, idx) {
    const service = this;
    setTimeout(() => {
      if (idx >= this.cardTools.CARDMAXHIGH - 6) {
        stack.deck.cards[idx].rotation = 0;
        service.aceStackAnimation(stack, idx - 1);
      } else {
        for (let c of stack.deck.cards) {
          c.visible = false;
        }
      }
    }, CONFIG.animations.fast);
  }
}
