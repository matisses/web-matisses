import { Component  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'matisses-redirect',
  template: `<span style="display: none">este es el componenete de funcionalidad de carrito</span>`
})

export class RedirectComponent {
  constructor(private _route: ActivatedRoute, private _router: Router) {
    this._route.params.forEach((params: Params) => {
      let previous: string = params['previous'];
      this._router.navigate([previous]);
    });
  }
}
