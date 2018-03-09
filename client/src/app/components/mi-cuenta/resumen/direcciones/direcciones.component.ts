import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'matisses-direcciones',
  templateUrl: 'direcciones.html',
  styleUrls: ['direcciones.component.css'],
})


export class DireccionesComponent implements OnInit {
  public direcciones: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.direcciones = Array<any>();
  }

  ngOnInit() {
    this.forDirecciones();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

public forDirecciones() {
  this.direcciones.push({
    name: "casa",
    direccion: "carrera 60 # 75AA sur 75 casa 239",
    info: "casas campestres pamplona"
  });
  this.direcciones.push({
    name: "oficina",
    direccion: "calle falsa 123",
    info: "Matisses"
  });
  this.direcciones.push({
    name: "El cielo",
    direccion: "Carrera 29a # 22 - 38",
    info: "Casa de jesus"
  });
}



}
