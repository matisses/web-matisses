import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ListaRegalosService } from '../../../../services/lista-regalos.service';

declare var $: any;

@Component({
  templateUrl: 'asistencia.html',
  providers: [ListaRegalosService]
})

export class AsistenciaComponent implements OnInit {
  public alergia: string;
  public alergico: string;
  public asiste: string;
  public queryParams: Map<string, string>;
  public queryString: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _listaRegalosService: ListaRegalosService) {
    this.alergia = "";
    this.alergico = "false";
    this.asiste = "true";
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  public confirmarAsistencia() {
    this._route.params.forEach((params: Params) => {
      let confirmarAsistenciaDTO = {
        idInvitado: params['codigoInvitado'],
        codigoLista: params['codigoLista'],
        alergia: this.alergia,
        asiste: this.asiste,
        alergico: this.alergico
      }

      //Llamar servicio para confirmar asistencia
      this._listaRegalosService.actualizarConfirmarAsistencia(confirmarAsistenciaDTO).subscribe(
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

  public limpiar() {
    this.alergia = "";
  }
}