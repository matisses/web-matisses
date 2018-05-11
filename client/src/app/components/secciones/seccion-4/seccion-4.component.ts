import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'seccion-4',
  templateUrl: 'seccion-4.html',
  styleUrls: ['seccion-4.component.css'],

})

export class Seccion4Component implements OnInit {


  constructor(private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

   }

}
