// Menu component
import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(public router: Router) {
  }

  public startLocal() {
    this.local.next();
  }

  public startOnline() {
    const hash = Math.floor(Math.random() * 100000);
    this.showMulti = true;
    this.hash = hash;
  }
}
