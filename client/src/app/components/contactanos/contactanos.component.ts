import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'contactanos.html',
  styleUrls: ['contactanos.component.css']
})

export class ContactanosComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el titulo';
  }

  ngOnInit() {
    //console.log('inicializando componente de lista de deseos');
  }

}
