import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';
import { ItemService } from '../../services/item.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

declare var $: any;

@Component({
  templateUrl: 'wish-list.html',
  styleUrls: ['wish-list.component.css'],
  providers: [ItemService]
})

export class WishListComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;
  public qty: number;
  public orderByStr: string = 'Precio: más bajos primero';
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {
    this.qty = 0;
  }

  ngOnInit() {
    this.obtenerItems();
  }

  private obtenerItems() {
    this.items = new Array<Item>();
    this.items = JSON.parse(localStorage.getItem('matisses.wishlist'));
    if (this.items) {
      this.qty = this.items.length;
      this.orderByPrice(1);
    } else {
      this.qty = 0;
    }
  }

  public agregarCarrito(item: Item) {
    item.selectedQuantity = 1;
    this.carrito.procesarItem(item);
    /*Se elimina el articulo de la lista de deseos*/
    this._itemService.toggleWishList(item);
    this.obtenerItems();
  }

  public eliminarItems(item: Item) {
    this._itemService.toggleWishList(item);
    this.obtenerItems();
  }

  private compareItems(a, b) {
    return a.priceaftervat - b.priceaftervat;
  }

  public orderByPrice(order) {
    this.items = this.items.sort((a, b) => this.compareItems(a, b));
    if (order < 0) {
      this.items = this.items.reverse();
      this.orderByStr = 'Precio: más altos primero';
    } else {
      this.orderByStr = 'Precio: más bajos primero';
    }
  }

  public formatNumber(num:number) {

    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
}
