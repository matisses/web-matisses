import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../../models/item';

import { ItemService } from '../../../services/item.service';

// declare var jquery: any;
declare var $: any;

@Component({
  selector: 'relacionados',
  templateUrl: 'producto-relacionados.html',
  styleUrls: ['producto-relacionados.component.css']
})

export class ProductoRelacionadosComponent implements OnInit {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _itemService: ItemService, private _router: Router) {
  }

  ngOnInit() {
    this.inicializarItems();
    this._itemService.inicializarWishlist();
  }

  private inicializarItems() {

    this.items = new Array<Item>();
    /*
        this.items.push(new Item().newItem('22400000000000000012', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
        this.items.push(new Item().newItem('23100000000000000495', 'Plato de postre', 56000));
        this.items.push(new Item().newItem('23100000000000000494', 'Plato de carga', 400000));
        this.items.push(new Item().newItem('23100000000000000493', 'Plato principal el cual esta es una prueba', 89000));
        this.items.push(new Item().newItem('22400000000000000012', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
        this.items.push(new Item().newItem('23100000000000000495', 'Plato de postre', 56000));
        this.items.push(new Item().newItem('23100000000000000494', 'Plato de carga', 400000));
        this.items.push(new Item().newItem('23100000000000000493', 'Plato principal el cual esta es una prueba', 89000));
        this.items.push(new Item().newItem('22400000000000000012', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
        this.items.push(new Item().newItem('23100000000000000495', 'Plato de postre', 56000));
        this.items.push(new Item().newItem('23100000000000000494', 'Plato de carga', 400000));
        this.items.push(new Item().newItem('23100000000000000493', 'Plato principal el cual esta es una prueba', 89000));
        */
  }


  public botonRight() {
    $('.section-relacionados').animate({ scrollLeft: '+=890' }, 500);
    return false;
  }

  public botonLeft() {
    $('.section-relacionados').animate({ scrollLeft: '-=890' }, 500);
    return false;
  }

  public scrollTop() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    return false;
  }

  public toggleWishList(item: Item) {
    this._itemService.toggleWishList(item);
  }

  public isInWishlist(item: Item) {
    return this._itemService.isInWishlist(item);
  }

  public getCSSClassName(item: Item) {
    return this._itemService.getCSSClassName(item);
  }

}
