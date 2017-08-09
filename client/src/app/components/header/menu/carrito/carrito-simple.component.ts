import { Component  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../../../models/item';

declare var $: any;

@Component({
  selector: 'matisses-carrito-simple',
  template: `<span style="display: none">este es el componenete de funcionalidad de carrito</span>`
})

export class CarritoSimpleComponent {
  public id: number = Math.random() * 1000 | 0;
  private idCarrito: string;
  public totalItems: number = 0;
  public totalCarrito: number = 0;
  public totalImpuestos: number = 0;
  public shoppingCart: any;
  public item: Item;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.inicializarShoppingCart();
    console.warn('inicializando carrito-simple id=' + this.id);
  }

  private inicializarShoppingCart() {
    this.shoppingCart = {
      _id: null,
      metodoEnvio: null,
      fechacreacion: new Date(),
      items: new Array<Item>()
    };
  }

  public cargarCarrito() {
    console.log('cargando carrito de localstorage');
    //consultar localstorage
    let localSC = JSON.parse(localStorage.getItem('matisses.shoppingCart'));
    if (!localSC) {
      this.inicializarShoppingCart();
    } else {
      this.shoppingCart = localSC;
    }
    //TODO: validar si el carrito esta vigente
    //TODO: validar el saldo y los precios de los items en el carrito si la fecha de creacion es del dia anterior

    if (this.shoppingCart.items === null) {
      this.shoppingCart.items = new Array<Item>();
      //this.items = new Array<Item>();
    }
    console.log(this.shoppingCart);
    this.procesarCarrito();
  }

  public procesarItem(item: Item) {
    console.log('procesando item')
    item.selectedQuantity = parseInt(item.selectedQuantity.toString());
    console.log(item);
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
    localStorage.setItem('matisses.shoppingCart', JSON.stringify(this.shoppingCart));
    //4. navegar
    //this._router.navigate(['/redirect',this._router.url]);
    //5. Actualizar contenido HTML
    this.procesarCarrito();

    let components = document.getElementsByClassName("total-items-carrito-badge");
    for (let i = 0; i < components.length; i++) {
      components[i].innerHTML = this.totalItems.toString();
    }
    //let cantidadCarrito = <HTMLElement>document.querySelector("#totalItemsCarrito");
    //let cantidadCarritoBadge = <HTMLElement>document.querySelector("#totalItemsCarritoBadge");

    //cantidadCarrito.innerHTML = this.totalItems.toString();
    //cantidadCarritoBadge.innerHTML = this.totalItems.toString();
    this.mostrarModal(item);

  }

  private mostrarModal(item: Item) {
    console.log('mostrando carrito');
    this.item = item;
  }

  private procesarCarrito() {
    this.totalItems = 0;
    this.totalCarrito = 0;
    this.totalImpuestos = 0;
    let totalSinIVA = 0;
    for (let i = 0; i < this.shoppingCart.items.length; i++) {
      let selectedQuantity = this.shoppingCart.items[i].selectedQuantity ? this.shoppingCart.items[i].selectedQuantity : 0;
      let price = this.shoppingCart.items[i].priceaftervat ? this.shoppingCart.items[i].priceaftervat : 0;
      totalSinIVA += (this.shoppingCart.items[i].pricebeforevat ? this.shoppingCart.items[i].pricebeforevat : 0) * selectedQuantity;
      this.totalItems += selectedQuantity;
      this.totalCarrito += (price * selectedQuantity);
    }
    this.totalImpuestos = (this.totalCarrito - totalSinIVA) | 0;
    console.log('total sin iva: ' + totalSinIVA);
    console.log('total impuestos: ' + this.totalImpuestos);
    console.log('el numero total de items es ' + this.totalItems);
  }
}
