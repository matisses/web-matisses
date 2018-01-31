import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../../services/item.service';
import { Item } from '../../../../models/item';

import {SessionUsuarioService } from '../../../../services/session-usuario.service';
import {ListaRegalosService } from '../../../../services/lista-regalos.service';
import { CarritoRegalosComponent } from '../carrito-regalos/carrito-regalos.component';
import { CarritoRegalosSimpleComponent } from '../carrito-regalos/carrito-regalos-simple.component';
import { ListaInvitadoComponent } from '../lista-invitado.component';



declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'resumen-regalos.html',
  styleUrls: ['resumen-regalos.component.css'],
  providers: [ItemService, SessionUsuarioService,ListaRegalosService]
})

export class ResumenRegalosComponent implements OnInit {

  @ViewChild(CarritoRegalosSimpleComponent) carrito: CarritoRegalosSimpleComponent;


  public messajeError: String = '';

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    //this.cargarCarrito();
    console.log('this.carrito '+this.carrito);
    // for (let i = 0; i < this.carrito.shoppingCart.items.length; i++) {
    //   if (this.carrito.shoppingCart.items[i].sinSaldo) {
    //     this.messajeError = 'No se pudo continuar con el proceso de compra, debido a que uno o varios ítems ya no tienen saldo disponible';
    //     break;
    //   }
    // }
  }

  ngAfterViewInit() {

    this.cargarCarrito();
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
      this._router.navigate(['/info-pago-regalos']);
    } else {
      this.messajeError = 'No se encntraron ítems para continuar';
    }
  }

  public cargarCarrito() {
    //consultar localstorage
    console.log('entra en el cargar resumen');
    let localSC = JSON.parse(localStorage.getItem('matisses.shoppingCart'));
    if (!localSC) {
      this.carrito.inicializarShoppingCart();
    } else {
      this.carrito.shoppingCart = localSC;
    }
    //TODO: validar si el carrito esta vigente
    //TODO: validar el saldo y los precios de los items en el carrito si la fecha de creacion es del dia anterior

    if (this.carrito.shoppingCart.items === null) {
      this.carrito.shoppingCart.items = new Array<Item>();
    }
    this.carrito.procesarCarrito();
  }



  }
