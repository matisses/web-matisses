import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SessionUsuarioService } from '../../services/session-usuario.service';

declare var $: any;

@Component({
  templateUrl: 'confirmacion-decorador.html',
  styleUrls: ['confirmacion-decorador.component.css'],
  providers: [SessionUsuarioService]
})

export class ConfirmDecoComponent implements OnInit {
  public title: string;
  public id: string;
  public agree: boolean;

  constructor(private _route: ActivatedRoute, private _router: Router, private _sessionUsuarioService: SessionUsuarioService) {
  }

  ngOnInit() {
    this.aceptarClausula();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

  private aceptarClausula() {
    this._route.queryParams.subscribe(
      params => {
        this.id = params['id'];
        this.agree = params['agree'];

        if (params['agree'] == 'false') {
          this.title = 'No aceptaste los siguientes beneficios y cláusulas.';
        } else {
          this.title = 'Has aceptado los siguientes beneficios y cláusulas.';
        }
      }
    );

    this._sessionUsuarioService.actualizarAceptoClausulaDecorador(this.id, this.agree).subscribe(
      response => {
        console.log(response);
      },
      error => { console.error(error); }
    );
  }
}