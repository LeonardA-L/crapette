// Deck component
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Stack } from './../../model/stack.model';

@Component({
  selector: 'stack',
  templateUrl: './stack.html',
  styleUrls: ['./stack.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class StackComponent {
  @Input()
  public stack: Stack;

}
