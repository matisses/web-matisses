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
  public carrito: CarritoSimpleComponent;
  public messajeError: String = '';

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    console.log('inicializando componente de resumen carrito');
    this.carrito.cargarCarrito();
  }

  public openResumen() {
    document.getElementById("resumen").style.height = "380px";
  }

  public closeResumen() {
    document.getElementById("resumen").style.height = "0";
  }

  public procesarItem(item: Item) {
    this.messajeError = '';
    if (item.selectedQuantity > item.availablestock) {
      console.log('Se está agregando una cantidad del ítem ' + item.itemcode + ' superior a la disponible');
      this.messajeError = 'La cantidad solicitada no está disponible para el ítem ' + item.itemname;
      //item.selectedQuantity = item.availablestock;
      return;
    }
    this.carrito.procesarItem(item);
    //this.carrito.cargarCarrito();
  }

  public eliminarItem(item: Item) {
    item.selectedQuantity = 0;
    this.carrito.procesarItem(item);
    //this.carrito.cargarCarrito();
  }

  public procederPago() {
    this.messajeError = '';
    if (this.carrito.shoppingCart.items != null && this.carrito.shoppingCart.items.length > 0) {
      for (let i = 0; i < this.carrito.shoppingCart.items.length; i++) {
        if (this.carrito.shoppingCart.items[i].selectedQuantity > this.carrito.shoppingCart.items[i].availablestock) {
          this.messajeError = 'La cantidad solicitada no está disponible para el ítem ' + this.carrito.shoppingCart.items[i].itemname;
          return;
        }
      }
      this._router.navigate(['/ingresar']);
    } else {
      this.messajeError = 'No se encntraron ítems para continuar';
    }
  }
}
