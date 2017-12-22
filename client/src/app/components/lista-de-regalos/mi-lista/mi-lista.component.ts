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

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.nombreUsuario = 'Alejandro Guerra';
  }

  ngOnInit() {
    $('#cambioContraseña').modal('show')
  }


  ngAfterViewInit() {

  }

}
