import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Customer } from '../../models/customer';

declare var $: any;

@Component({
  templateUrl: 'info-pago.html',
  styleUrls: ['info-pago.component.css']
})

export class InfoPagoComponent implements OnInit {
  public title: string;
  public customer: Customer;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo de informacion de pago';
  }

  ngOnInit() {
    console.log('inicializando componente de información de pago');
  }
}
