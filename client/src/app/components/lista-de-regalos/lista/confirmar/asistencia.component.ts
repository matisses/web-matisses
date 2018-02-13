import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ListaRegalosService } from '../../../../services/lista-regalos.service';

declare var $: any;

@Component({
  templateUrl: 'asistencia.html',
  providers: [ListaRegalosService]
})

export class AsistenciaComponent implements OnInit {
  public queryParams: Map<string, string>;
  public queryString: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _listaRegalosService: ListaRegalosService) {
  }

  ngOnInit() {
    this.confirmarAsistencia();
  }

  ngAfterViewInit() {
  }

  public confirmarAsistencia() {
    this._route.params.forEach((params: Params) => {
      //Llamar servicio para confirmar asistencia
      this._listaRegalosService.actualizarConfirmarAsistencia(params['codigoLista'], params['codigoInvitado']).subscribe(
        response => {
          this.navigate(params['codigoLista']);
        }, error => { console.error(error); }
      );
    });
  }

  private navigate(codigoLista: string) {
    let queryParamsObj = {};
    queryParamsObj['codigoLista'] = codigoLista;
    this._router.navigate(['/lista'], { queryParams: queryParamsObj });
  }
}
