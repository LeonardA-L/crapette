// Card component
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Card } from './../../model/card.model';  // Get the model
import { CardToolsService } from './../../services/card-tools.service';  // Get the model

@Component({
  selector: 'card',
  templateUrl: './card.html',
  styleUrls: ['./card.scss', '../../../assets/css/sprite-src-assets-img-suits.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CardComponent {
  @Input()
  public card: Card;

  constructor(public cardToolsService: CardToolsService) {}

}
