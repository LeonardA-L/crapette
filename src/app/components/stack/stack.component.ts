// Deck component
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Stack } from './../../model/stack.model';

import { CrapetteService } from './../../services/crapette.service';
import { AppState } from './../../app.service';

@Component({
  selector: 'stack',
  templateUrl: './stack.html',
  styleUrls: ['./stack.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class StackComponent {
  @Input()
  public stack: Stack;

  @Output()
  public pick = new EventEmitter();

  @Output()
  public push = new EventEmitter();

  constructor(
    public crapetteService: CrapetteService,
    public appState: AppState,
  ) {}

  public clickCard(card) {
    if (this.crapetteService.pickedCard
      && this.stack.pushRule(this.stack, this.crapetteService.pickedCard,
        this.appState, this.appState.get('currentPlayer'))) {
      this.push.next(this);
    } else if (!this.crapetteService.pickedCard && card) {
      this.pickCard(card);
    }
  }

  public computeShift(card, stack, idx) {
    let res = (4 - idx) * 3;

    if (stack.spread) {
      res = 20 * stack.spread * idx;
    }

    return res + 'px';
  }

  private pickCard(card) {
    if (this.stack.popRule(this.stack, card, this.appState, this.appState.get('currentPlayer'))) {
      this.pick.next(this);
    }
  }
}
