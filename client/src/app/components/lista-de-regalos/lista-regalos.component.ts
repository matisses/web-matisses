import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'lista-regalos.html',
  styleUrls: ['lista-regalos.component.css']
})

export class ListaRegalosComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {

  }


  ngAfterViewInit() {

  }

}
