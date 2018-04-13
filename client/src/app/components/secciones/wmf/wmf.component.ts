import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'seccion-wmf',
  templateUrl: 'wmf.html',
  styleUrls: ['wmf.component.css'],
})

export class WmfSeccionComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() { }

  ngAfterViewInit() { }

}
