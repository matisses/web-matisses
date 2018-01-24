import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'info-bogota.html',
  styleUrls: ['info-bogota.component.css'],
})

export class InfoBogotaComponent implements OnInit {


  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {

  }
}
