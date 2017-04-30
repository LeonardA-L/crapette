// Card tools service

import { Injectable, ApplicationRef } from '@angular/core';
import { Broadcaster } from './broadcast.service';
import { CardToolsService } from './card-tools.service';

import { StackTypes } from './../model/stack.model';

import { CONFIG } from '../environment';

@Injectable()
export class AnimationService {
  public crapette = false;

  constructor(
    private broadcaster: Broadcaster,
    private cardTools: CardToolsService,
    public appRef: ApplicationRef,
  ) {}

  public init() {
    /* const self = this
    window.crapetteAnim = ()=>self.onCrapette()*/

    const service = this;
    this.broadcaster.on<string>('postCardPush').subscribe((event) => service.onPostCardPush(event));
    this.broadcaster.on<string>('crapette').subscribe((event) => service.onCrapette(event));
  }

  private onPostCardPush(event) {
    const stack = event.stack;
    if (stack.type === StackTypes.ACE && stack.deck.cards.length === this.cardTools.CARDMAXHIGH) {
      this.aceStackAnimation(stack, stack.deck.cards.length - 1);
    }
  }

  private onCrapette(event) {
    const service = this;
    let left;
    let right;

    this.crapette = true;
    this.appRef.tick();

    const bottom = '101vh';
    const top = '-102vh';

    new Promise((resolve, reject) => {
      setTimeout(() => {
        const hub = document.querySelectorAll('hub')[0];
        hub['style'].width = '90vw';
        hub['style'].left = '5vw';

        const background = document.querySelectorAll('.splash-wrap')[0];
        background['style'].background = 'transparent';

        const buttons = Array.from(document.querySelectorAll('hub button'));
        for (let b of buttons) {
          b['style'].display = 'none';
        }

        left = document.querySelectorAll('.splash.left')[0];
        right = document.querySelectorAll('.splash.right')[0];
        const p = 'relative';
        left['style'].position = p;
        right['style'].position = p;

        left['style'].top = top;
        right['style'].top = bottom;
        resolve();

      }, 0);
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {

          left['style'].top = bottom;
          right['style'].top = top;

          resolve();

        }, 10);
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {

          service.crapette = false;
          service.appRef.tick();

          resolve();

        }, 1800);
      });
    });
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
