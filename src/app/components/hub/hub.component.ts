// Menu component
import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { CONFIG } from '../../environment';

@Component({
  selector: 'hub',
  templateUrl: './hub.html',
  styleUrls: ['./hub.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HubComponent implements OnInit {
  public showMulti = false;
  public hash;
  public baseUrl = CONFIG.baseUrl;
  public enableOnline = false;

  @Output()
  public local = new EventEmitter();

  @Input()
  public winner;

  constructor(
    public router: Router,
    public translate: TranslateService,
    private http: Http,
  ) {
  }

  public ngOnInit() {
    this.http.get(CONFIG.multiServerUrl + '/status')
      .catch(this.handleHttpError)
      .subscribe((res: Response) => this.extractData(res));
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

  private extractData(res: Response) {
    let body = res.json();
    if (body.status === 'ok') {
      this.enableOnline = CONFIG.enableOnline;
    }
  }

  private handleHttpError(err, obs): any {
    return Observable.throw('Server not found');
  }
}
