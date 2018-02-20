import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'beneficios.html',
  styleUrls: ['beneficios.component.css'],
})

export class BeneficiosComponent implements OnInit {


  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }

}
