// Menu component
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { CONFIG } from '../../environment';

@Component({
  selector: 'hub',
  templateUrl: './hub.html',
  styleUrls: ['./hub.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HubComponent {
  public showMulti = false;
  public hash;
  public baseUrl = CONFIG.baseUrl;
  public enableOnline = CONFIG.enableOnline;

  @Output()
  public local = new EventEmitter();

  @Input()
  public winner;

  constructor(
    public router: Router,
    public translate: TranslateService,
  ) {
  }

  public winnerTranslate() {
    if (this.winner) {
      return {
        id: this.winner.id + 1
      };
    }
    throw 'No winner';
  }

  public startLocal() {
    this.local.next();
  }

  public startOnline() {
    const hash = Math.floor(Math.pow(16, 6) * Math.random()).toString(16);
    this.showMulti = true;
    this.hash = hash;
  }
}
