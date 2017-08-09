import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'ingresar.html',
  styleUrls: ['ingresar.component.css']
})

export class IngresarComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo de ingresar';
  }

  ngOnInit() {
    //console.log('inicializando componente de ingresar');
  }

}
