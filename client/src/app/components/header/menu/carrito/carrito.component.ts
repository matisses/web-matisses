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
  public url: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.url = this._router.url;
  }

  ngOnInit() {
    console.log('inicializando componente de carrito');
    this.carrito.cargarCarrito();
  }

  public openResumen() {
    document.getElementById("resumen").style.height = "380px";
    this.carrito.cargarCarrito();
  }

  public closeResumen() {
    document.getElementById("resumen").style.height = "0";
  }

  public eliminarItem(item: Item) {
    item.selectedQuantity = 0;
    this.carrito.procesarItem(item);
  }

  public mostrarBotonEliminar(){
    return this.url && !this.url.includes('pago') && !this.url.includes('carrito');
  }
}
