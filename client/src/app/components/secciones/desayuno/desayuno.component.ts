import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'seccion-desayunos',
  templateUrl: 'desayuno.html',
  styleUrls: ['desayuno.component.css'],

})

export class DesayunosSeccionComponent implements OnInit {


  constructor(private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

   }

}
