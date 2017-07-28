import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'info-pago.html',
  styleUrls: ['info-pago.component.css']
})

export class InfoPagoComponent implements OnInit {
  public title: string;
  public number: string;
  public items:Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo de informacion de pago';
    this.number = '3';
  }

  ngOnInit() {
    console.log('inicializando componente de información de pago');
    this.inicializarItems();
  }

  private inicializarItems(){

    this.items = new Array<Item>();
    this.items.push(new Item().newItem('22400000000000000012', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
  }

}
