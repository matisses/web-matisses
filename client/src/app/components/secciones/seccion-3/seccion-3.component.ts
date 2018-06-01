import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'seccion-3',
  templateUrl: 'seccion-3.html',
  styleUrls: ['seccion-3.component.css'],

})

export class Seccion3Component implements OnInit {


  constructor(private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

   }

}
