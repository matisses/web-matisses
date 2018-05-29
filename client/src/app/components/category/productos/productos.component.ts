import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

import { CarritoSimpleComponent } from '../../header/menu/carrito/carrito-simple.component';

declare var $: any;

@Component({
  selector: 'productos-matisses',
  templateUrl: 'productos.html',
  styleUrls: ['productos.component.css'],
  providers: [ItemService]
})

export class ProductosComponent {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;
  public totalItems: number;
  public activePage: number;
  public itemsXPag: string;
  public orderByStr: string;
  public pages: Array<number>;
  public items: Array<Item>;
  public queryParams: Map<string, string>;
  private availableFields: string[];

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router) {
    this.queryParams = new Map<string, string>();
    this.itemsXPag = '12 x pag';
    this.orderByStr = 'Similares';
    this.pages = new Array<number>();
    this.items = new Array<Item>();
  }

  ngAfterViewInit() {
    this._itemService.inicializarWishlist();
  }

  public cargarItems(availableFields, items, queryParams, records) {
    this.items = items;
    this.availableFields = availableFields;
    this.queryParams = queryParams;
    this.totalItems = records;
    this.pages = new Array<number>();
    if (this.queryParams.has('pageSize')) {
      if (this.queryParams.get('pageSize') === '10000') {
        this.itemsXPag = 'Todos';
      } else {
        this.itemsXPag = this.queryParams.get('pageSize') + ' x pag';
      }
    }
    if (this.queryParams.has('orderBy')) {
      switch (this.queryParams.get('orderBy')) {
        case 'price':
          this.orderByStr = 'Precio: <span class="glyphicon glyphicon-sort-by-order"></span> ';
          break;
        case '-price':
          this.orderByStr = 'Precio: <span class="glyphicon glyphicon-sort-by-order-alt"></span> ';
          break;
        case 'itemname':
          this.orderByStr = 'Nombre: <span class="glyphicon glyphicon-sort-by-alphabet"></span> ';
          break;
        case '-itemname':
          this.orderByStr = 'Nombre: <span class="glyphicon glyphicon-sort-by-alphabet-alt"></span> ';
          break;
        default:
          this.orderByStr = 'Similares';
      }
    } else {
      this.orderByStr = 'Similares';
    }
    this.activePage = parseInt(this.queryParams.has('page') ? this.queryParams.get('page') : '1');
    let pageSize = parseInt(this.queryParams.has('pageSize') ? this.queryParams.get('pageSize') : '12');
    let totalPages = Math.ceil(this.totalItems / pageSize);
    if (this.activePage > totalPages || this.activePage <= 0) {
      this.activePage = 1;
    }

    let initialPage;
    if (this.activePage > 3) {
      if (this.activePage + 2 <= totalPages) {
        initialPage = this.activePage - 2;
      } else {
        initialPage = totalPages - 3;
      }
    } else {
      initialPage = 1;
    }
    for (let i = initialPage; i <= totalPages && i - initialPage < 5; i++) {
      this.pages.push(i);
    }
  }

  private navigate() {
    let queryParamsObj = {};
    for (let i = 0; i < this.availableFields.length; i++) {
      let key = this.availableFields[i];
      queryParamsObj[key] = this.queryParams.get(key);
    }
    this._router.navigate(['/categoria'], { queryParams: queryParamsObj });
  }

  public cambiarTamanoPagina(tamano) {
    this.queryParams.set('pageSize', tamano);
    this.queryParams.set('page', '1');
    this.navigate();
  }

  public irAPagina(pagina) {
    this.queryParams.set('page', pagina);
    this.navigate();
  }

  public changeOrder(orderkey) {
    this.queryParams.set('orderBy', orderkey);
    this.queryParams.set('page', '1');
    this.navigate();
  }

  public agregarCarrito(item: Item) {
    item.selectedQuantity = 1;
    this.carrito.procesarItem(item);
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

  public formatNumber(num:number) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

}
