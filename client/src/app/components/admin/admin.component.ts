import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { JWTService } from '../../services/jwt.service';

@Component({
  templateUrl: 'admin.component.html',
  providers: [JWTService]
})

export class AdminComponent implements OnInit {

  constructor(private _jwt: JWTService, private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    //console.log('inicializando componente de administracion del sitio');
    this.cargarToken();
  }

  private cargarToken() {
    this._route.params.forEach((params: Params) => {
      let token: string = params['token'];
      this._jwt.validateToken(token).subscribe(
        response => {
          console.log(response);
          localStorage.setItem('matisses.admin-token', token);
          this._router.navigate(['/']);
        }, error => {
          console.error(error);
          localStorage.removeItem('matisses.admin-token');
        }
      );
    });
  }
}
