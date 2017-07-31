import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

import { Item } from '../../models/item';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

@Component({
  selector: 'resumen-carrito',
  templateUrl: 'resumen-carrito.html',
  styleUrls: ['resumen-carrito.component.css']
})

export class ResumenCarritoComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public totalItems: number = 0;
  public totalCarrito: number = 0;
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.items = new Array<Item>();
  }

  ngOnInit() {
    console.log('inicializando componente de resumen carrito');
    this.carrito.cargarCarrito();
    this.procesarCarrito();
    this.items = this.carrito.items;
  }

  public openResumen() {
    document.getElementById("resumen").style.height = "380px";
  }

  public closeResumen() {
    document.getElementById("resumen").style.height = "0";
  }

  private procesarCarrito() {
    this.totalItems = 0;
    this.totalCarrito = 0;
    for (let i = 0; i < this.carrito.items.length; i++) {
      this.totalItems += this.carrito.items[i].selectedQuantity;
      this.totalCarrito += (this.carrito.items[i].price * this.carrito.items[i].selectedQuantity);
    }
    console.log('el numero total de items es ' + this.totalItems);
    console.log('el valor total de items es ' + this.totalCarrito);
  }

  public procesarItem(item: Item) {
    if (item.selectedQuantity > item.availablestock) {
      console.log('Se está agregando una cantidad del ítem ' + item.itemcode + ' superior a la disponible');
      item.selectedQuantity = item.availablestock;
    } else {
      this.carrito.procesarItem(item);
    }
  }

  public eliminarItem(item: Item) {
    item.selectedQuantity = 0;
    this.carrito.procesarItem(item);
    this.procesarCarrito();
  }
}
