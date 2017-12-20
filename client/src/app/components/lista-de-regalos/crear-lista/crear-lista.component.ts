import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'crear-lista.html',
  styleUrls: ['crear-lista.component.css']
})

export class CrearListaComponent implements OnInit {
  public tipoEvento: number = 0;
  public paso: number = 1;

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
  }


  ngAfterViewInit() {

  }

  public seleccionarEvento(id) {
    this.tipoEvento = id;
  }

  public obtenerSiguientePaso() {
    if (this.paso < 4) {
      this.paso++;
    }
  }

  public obtenerPasoAnterior() {
    if (this.paso < 5) {
      this.paso--;
    }
  }

}
