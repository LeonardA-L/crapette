// Menu component
import { Component, ViewEncapsulation } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class MenuComponent {
  public out: boolean;
  public state: String;

  constructor(
    public settings: SettingsService,
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
}
