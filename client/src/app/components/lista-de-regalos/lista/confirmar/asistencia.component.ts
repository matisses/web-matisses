import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  templateUrl: 'asistencia.html'
})

export class AsistenciaComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    this.confirmarAsistencia();
  }

  ngAfterViewInit() {
  }

  public confirmarAsistencia() {
    console.log('Confirmando asistencia');
    //this._router.navigate(['lista/JG20180309']);
    //this._router.navigate(['/lista?codigoLista=JG20180309']);
  }
}
