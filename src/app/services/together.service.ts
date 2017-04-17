// TogetherJS service
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class TogetherService {

  constructor(private route: ActivatedRoute) {
  }

  public init () {
    const routeParams = this.route.snapshot.params;
    console.log(routeParams);
  }
}
