import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'agregar-productos.html',
  styleUrls: ['agregar-productos.component.css']
})

export class AgregarProductosComponent implements OnInit {


  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {

  }


  ngAfterViewInit() {

  }

}
