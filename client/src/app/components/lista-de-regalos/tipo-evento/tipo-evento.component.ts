import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'tipo-evento.html',
  styleUrls: ['tipo-evento.component.css']
})

export class TipoEventoComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {

  }


  ngAfterViewInit() {

  }

}
