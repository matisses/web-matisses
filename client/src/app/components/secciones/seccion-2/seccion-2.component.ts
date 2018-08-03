import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'seccion-2',
  templateUrl: 'seccion-2.html',
  styleUrls: ['seccion-2.component.css'],

})

export class Seccion2Component implements OnInit {


  constructor(private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

   }

}
