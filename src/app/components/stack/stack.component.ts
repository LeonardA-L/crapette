// Deck component
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Stack, StackTypes } from './../../model/stack.model';

import { CrapetteService } from './../../services/crapette.service';
import { AppState } from './../../app.service';

import { SettingsService } from '../../services/settings.service';

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

  public stackTypes = StackTypes;

  constructor(
    public crapette: CrapetteService,
    public appState: AppState,
    public settings: SettingsService,
  ) {}

  public clickCard(card) {
    const player = this.appState.get('currentPlayer');
    if (this.crapette.pickedCard
      && (this.stack.pushRule(this.stack, this.crapette.pickedCard, this.appState, player, this.crapette.pickedStack)
      || (this.stack.cancelable && this.stack === this.crapette.pickedStack) )) {
      this.push.next(this);
    } else if (!this.crapette.pickedCard && card) {
      this.pickCard(card);
    } else if (!card && this.stack.type === StackTypes.MAIN && this.stack.owner === player) {
      this.crapette.refillMain(player);
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
    if (this.stack.popRule(this.stack, card, this.appState, this.appState.get('currentPlayer'), this.crapette.pickedStack)) {
      this.pick.next(this);
    }
  }
}
