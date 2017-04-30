/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

import { TranslateService } from '@ngx-translate/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app.html',
  styleUrls: ['app.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    public appState: AppState,
    public translate: TranslateService,
  ) {}

  public ngOnInit() {
    const useLocale = navigator.language === 'fr' ? 'fr' : 'en';
    this.translate.setDefaultLang(useLocale);
  }

}
