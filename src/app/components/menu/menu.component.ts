// Menu component
import { Component, ViewEncapsulation } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss', '../../../assets/css/sprite-src-assets-img-icons.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class MenuComponent {
  public out: boolean;
  public state: String = 'settings';

  constructor(
    public settings: SettingsService,
    public translate: TranslateService,
  ) {}

  public openMenu() {
    this.out = true;
  }

  public closeMenu() {
    this.out = false;
  }

  public clickButton(name: String) {
    if (this.out && name === this.state) {
      this.closeMenu();
      return;
    }

    this.state = name;
    this.openMenu();
  }

  public changeLocale(newLocale) {
    this.translate.use(newLocale);
  }
}
