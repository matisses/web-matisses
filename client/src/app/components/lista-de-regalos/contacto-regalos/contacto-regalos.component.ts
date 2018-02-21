import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'contacto-regalos.html',
  styleUrls: ['contacto-regalos.component.css'],
})

export class ContactoRegalosComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {}

  ngAfterViewInit() {}

}
