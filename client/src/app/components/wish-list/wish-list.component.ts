import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'wish-list.html',
  styleUrls: ['wish-list.component.css']
})

export class WishListComponent implements OnInit {
  public number: string;
  public items:Array<Item>;
  public orderByStr: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.number = '4';
  }

  ngOnInit() {
    //console.log('inicializando componente de lista de deseos');
    this.inicializarItems();
  }

  private inicializarItems(){

    this.items = new Array<Item>();
    this.items.push(new Item().newItem('22400000000000000012', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
    this.items.push(new Item().newItem('23100000000000000495', 'Plato de postre', 56000));
    this.items.push(new Item().newItem('22400000000000000012', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
    this.items.push(new Item().newItem('23100000000000000495', 'Plato de postre', 56000));
    this.items.push(new Item().newItem('22400000000000000012', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
    this.items.push(new Item().newItem('23100000000000000495', 'Plato de postre', 56000));
    this.items.push(new Item().newItem('22400000000000000012', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
    this.items.push(new Item().newItem('23100000000000000495', 'Plato de postre', 56000));
  }

  public changeOrder(order){

  }

}
