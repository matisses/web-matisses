import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../../../models/item';

import { DescuentosService } from '../../../../services/descuentos.service';
import { ItemService } from '../../../../services/item.service';

declare var $: any;

@Component({
  selector: 'matisses-carrito-regalos-simple',
  template: `<span style="display: none">este es el componenete de funcionalidad de carrito</span>`,
  providers: [DescuentosService, ItemService]
})

export class CarritoRegalosSimpleComponent {
  public id: number = Math.random() * 1000 | 0;
  private idCarrito: string;
  public totalItems: number = 0;
  public totalCarrito: number = 0;
  public totalImpuestos: number = 0;
  public totalDescuentos: number = 0;
  public mostrar: boolean = true;
  public shoppingCart: any;
  public item: Item;

  constructor(private _route: ActivatedRoute, private _router: Router, private _descuentosService: DescuentosService, private _itemService: ItemService) {
    this.inicializarShoppingCart();
  }

  public inicializarShoppingCart() {

    this.shoppingCart = {
      _id: null,
      metodoEnvio: null,
      fechacreacion: new Date(),
      items: new Array<Item>(),
      bono: {
        valor: 0,
        isBono: false
      }
    };
  }

  public cargarCarrito() {
    //consultar localstorage

    let localSC = JSON.parse(localStorage.getItem('matisses.shoppingCart.List'));
    if (!localSC) {
      this.inicializarShoppingCart();
    } else {
      this.shoppingCart = localSC;
    }
    //TODO: validar si el carrito esta vigente
    //TODO: validar el saldo y los precios de los items en el carrito si la fecha de creacion es del dia anterior

    if (this.shoppingCart.items === null) {
      this.shoppingCart.items = new Array<Item>();
    }
    this.procesarCarrito();
  }

  public procesarItem(item: Item) {

    item.selectedQuantity = parseInt(item.selectedQuantity.toString());
    if (item.selectedQuantity > 0) {
      let items = new Array<Item>();
      items.push(item);

      this._itemService.validarItems(items).subscribe(
        response => {
          if (response[0].sinSaldo) {
            //modal sin saldo
            item.availablestock = response[0].availablestock;
            localStorage.setItem('matisses.lastAddedItem', JSON.stringify(item));
            $('#modalSinSaldo').modal('show');
          } else {
            this.cambiarItem(item);
          }
        },
        error => { console.error(error); }
      );
    } else {
      this.cambiarItem(item);
    }
  }

  public mostrarModalCarrito(show: boolean) {
    if (show) {
      this.mostrar = true;
      this.cargarCarrito();
    } else {
      this.mostrar = false;
      this.cargarCarrito();
    }
  }

  public cambiarItem(item: Item) {
    //0. Cargar contenido de localStorage
    this.cargarCarrito();
    //1. validar contenido
    let encontrado = false;
    for (let i = 0; i < this.shoppingCart.items.length; i++) {
      if (this.shoppingCart.items[i].itemcode === item.itemcode) {
        encontrado = true;
        if (item.selectedQuantity === 0) {
          //eliminar item
          this.shoppingCart.items.splice(i, 1);
        } else {
          //modificar el item
          this.shoppingCart.items[i].selectedQuantity = item.selectedQuantity;
        }
        break;
      }
    }
    //2. agregar
    if (!encontrado) {
      this.shoppingCart.items.push(item);
    }
    //3. guardar
    localStorage.setItem('matisses.shoppingCart.List', JSON.stringify(this.shoppingCart));
    //4. Actualizar contenido HTML
    this.procesarCarrito();

    let components = document.getElementsByClassName("total-items-carrito-badge");
    for (let i = 0; i < components.length; i++) {
      components[i].innerHTML = this.totalItems.toString();
    }

    if (!encontrado && this.mostrar) {
      localStorage.setItem('matisses.lastAddedItem', JSON.stringify(item));
      $('#carritoModal').modal('show');
    }
  }

  public procesarCarrito() {
    this.totalItems = 0;
    this.totalCarrito = 0;
    this.totalImpuestos = 0;
    this.totalDescuentos = 0;
    let totalSinIVA = 0;
    for (let i = 0; i < this.shoppingCart.items.length; i++) {
      let selectedQuantity = this.shoppingCart.items[i].selectedQuantity ? this.shoppingCart.items[i].selectedQuantity : 0;
      let price = this.shoppingCart.items[i].priceaftervat ? this.shoppingCart.items[i].priceaftervat : 0;
      this.totalItems += selectedQuantity;
      this.totalCarrito += (price * selectedQuantity);
      if (this.shoppingCart.items[i].priceafterdiscount && this.shoppingCart.items[i].priceafterdiscount > 0) {
        let valorIVA = this.shoppingCart.items[i].priceafterdiscount * this.shoppingCart.items[i].taxpercent / 100;
        totalSinIVA += ((this.shoppingCart.items[i].priceafterdiscount - valorIVA) * selectedQuantity);
        this.totalDescuentos += ((this.shoppingCart.items[i].priceaftervat / 100) * this.shoppingCart.items[i].descuento) * selectedQuantity;
      } else {
        totalSinIVA += (this.shoppingCart.items[i].pricebeforevat ? this.shoppingCart.items[i].pricebeforevat : 0) * selectedQuantity;
      }
    }
    this.totalImpuestos = (this.totalCarrito - this.totalDescuentos - totalSinIVA) | 0;
  }
}
