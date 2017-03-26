// Card component
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Card } from './../../model/card.model';  // Get the model

@Component({  // Declare the Todo item component with its view and style
  selector: 'card',
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CardComponent {
  // This class receives a Todo item as an input value through the component's attributes
  @Input()
  public card: Card;

}
