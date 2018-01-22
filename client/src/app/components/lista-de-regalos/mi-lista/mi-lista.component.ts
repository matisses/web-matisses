import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'mi-lista.html',
  styleUrls: ['mi-lista.component.css']
})

export class MiListaComponent implements OnInit {
  public nombreUsuario: string;
  public claveNueva:string;
  public claveConfirmacion:string;
  public messageError: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.nombreUsuario = localStorage.getItem('username-lista');
  }

  ngOnInit() {
    if(localStorage.getItem('cambio-clave')=='si'){
      $('#cambioContraseña').modal('show');
    }
  }


  ngAfterViewInit() {

  }

  public actualizarClave(){


  }

}
