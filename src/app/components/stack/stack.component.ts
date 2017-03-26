// Deck component
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Stack } from './../../model/stack.model';

import { CrapetteService } from './../../services/crapette.service';

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
  ) {}

  public clickCard(card) {
    if (this.crapetteService.pickedCard
      && this.stack.pushRule(this.stack, card, this.crapetteService.currentPlayer)) {
      this.push.next(this);
    } else if (card) {
      this.pickCard(card);
    }
  }

  private pickCard(card) {
    if (this.stack.popRule(this.stack, card, this.crapetteService.currentPlayer)) {
      this.pick.next(this);
    }
  }
}
