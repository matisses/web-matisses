import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'producto.html',
  styleUrls: ['producto.component.css']
})

export class ProductoComponent implements OnInit {
  public images: Array<string>;
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.images = new Array<string>();
  }

  ngOnInit() {
    console.log('inicializando componente de producto');
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this.items.push(new Item().newItem('25400000000000000018', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
    let maxImages = Math.random()*7 |0;

    for(let i = 1; i <= maxImages; i++){
      this.images.push('25400000000000000018_0'+i);
    }
    console.log(this.images);
  }

  public toggleClass(idComponent) {
    $(idComponent).toggleClass("icon-plus icon-minus");
  }
}
