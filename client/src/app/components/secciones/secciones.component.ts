import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'secciones',
  templateUrl: 'secciones.html',
  styleUrls: ['secciones.component.css'],
})

export class SeccionesComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() { }

  ngAfterViewInit() { }

}
