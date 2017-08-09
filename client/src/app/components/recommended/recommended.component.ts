import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

import { RecommendedItemService } from '../../services/recommended.service';
import { ItemService } from '../../services/item.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'recommended',
  templateUrl: 'recommended.html',
  styleUrls: ['recommended.component.css'],
  providers: [RecommendedItemService, ItemService]
})

export class RecommendedComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public items: Array<Item>;

  constructor(private _recommmendedService: RecommendedItemService, private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    console.log('inicializando componente de recomendados');
    this.inicializarItems();
    this._itemService.inicializarWishlist();
  }

  private inicializarItems() {
    this.items = new Array<Item>();

    this._recommmendedService.list().subscribe(
      response => {
        console.log(response);
        for (let i = 0; i < response.result.length; i++) {
          this.items.push(response.result[i].itemId);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  mostrarArticulo(articulo) {
    console.log(articulo);
  }

  public botonRight() {
    console.log('has dado click al botón right');
    $('.section').animate({ scrollLeft: '+=890' }, 500);
    return false;
  }

  public botonLeft() {
    console.log('has dado click al botón right');
    $('.section').animate({ scrollLeft: '-=890' }, 500);
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

  public agregarCarrito(item: Item) {
    item.selectedQuantity = 1;
    this.carrito.procesarItem(item);
  }
}
