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
    this.carrito.cargarCarrito();
    for (let i = 0; i < this.carrito.shoppingCart.items.length; i++) {
      if (this.carrito.shoppingCart.items[i].sinSaldo) {
        this.messajeError = 'No se pudo continuar con el proceso de compra, debido a que uno o varios ítems ya no tienen saldo disponible';
        break;
      }
    }
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
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
      this.messajeError = 'La cantidad solicitada no está disponible para el ítem ' + item.itemname + ', cantidad disponible ' + item.availablestock;
      return;
    }
    this.carrito.procesarItem(item);
  }

  public eliminarItem(item: Item) {
    item.selectedQuantity = 0;
    this.carrito.procesarItem(item);
  }

  public procederPago() {
    this.messajeError = '';
    if (this.carrito.shoppingCart.items != null && this.carrito.shoppingCart.items.length > 0) {
      for (let i = 0; i < this.carrito.shoppingCart.items.length; i++) {
        if (this.carrito.shoppingCart.items[i].selectedQuantity > this.carrito.shoppingCart.items[i].availablestock) {
          this.messajeError = 'La cantidad solicitada no está disponible para el ítem ' + this.carrito.shoppingCart.items[i].itemname
            + ', cantidad disponible ' + this.carrito.shoppingCart.items[i].availablestock;
          return;
        }
      }
      //TODO: se debe modificar la ruta cuando se habilite el inicio de sesion a usuarios
      //this._router.navigate(['/ingresar']);
      this._router.navigate(['/info-pago']);
    } else {
      this.messajeError = 'No se encntraron ítems para continuar';
    }
  }
}
