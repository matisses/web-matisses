import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../../../models/item';

import { CarritoSimpleComponent } from './carrito-simple.component';

@Component({
  selector: 'matisses-carrito',
  templateUrl: 'carrito.html',
  styleUrls: ['carrito.component.css']
})
export class CarritoComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public totalItems: number = 0;
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.items = new Array<Item>();
  }

  ngOnInit() {
    console.log('inicializando componente de carrito');
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
    for (let i = 0; i < this.carrito.items.length; i++) {
      this.totalItems += this.carrito.items[i].selectedQuantity;
    }
    console.log('el numero total de items es ' + this.totalItems);
  }

  public eliminarItem(item: Item) {
    item.selectedQuantity = 0;
    this.carrito.procesarItem(item);
    this.procesarCarrito();
  }
}
