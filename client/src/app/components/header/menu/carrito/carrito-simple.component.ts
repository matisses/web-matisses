import { Component  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../../../models/item';

@Component({
  selector: 'matisses-carrito-simple',
  template: `<span style="display: none">este es el componenete de funcionalidad de carrito</span>`
})

export class CarritoSimpleComponent {
  public items: Array<Item>;
  public totalItems: number = 0;
  public totalCarrito: number = 0;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.items = new Array<Item>();
  }

  public cargarCarrito() {
    console.log('cargando carrito de localstorage');
    //consultar localstorage
    this.items = JSON.parse(localStorage.getItem('matisses.carrito'));
    console.log(this.items);
    this.procesarCarrito();
  }

  public procesarItem(item: Item) {
    console.log('procesando item')
    console.log(item);
    //0. Cargar contenido de localStorage
    this.cargarCarrito();
    //1. validar contenido
    let encontrado = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].itemcode === item.itemcode) {
        encontrado = true;
        if (item.selectedQuantity === 0) {
          //eliminar item
          this.items.splice(i, 1);
        } else {
          //modificar el item
          this.items[i].selectedQuantity = item.selectedQuantity;
        }
        break;
      }
    }
    //2. agregar
    if (!encontrado) {
      this.items.push(item);
    }
    //3. guardar
    localStorage.setItem('matisses.carrito', JSON.stringify(this.items));
    //4. navegar
    //console.log(new Date().getTime());
    //this._router.navigate(['/redirect',this._router.url]);
    //5. Actualizar contenido HTML
    this.procesarCarrito();
    let cantidadCarrito = <HTMLElement>document.querySelector("#totalItemsCarrito");
    let cantidadCarritoBadge = <HTMLElement>document.querySelector("#totalItemsCarritoBadge");

    cantidadCarrito.innerHTML = this.totalItems.toString();
    cantidadCarritoBadge.innerHTML = this.totalItems.toString();
  }

  private procesarCarrito() {
    this.totalItems = 0;
    this.totalCarrito = 0;
    for (let i = 0; i < this.items.length; i++) {
      this.totalItems += this.items[i].selectedQuantity;
      this.totalCarrito += (this.items[i].price * this.items[i].selectedQuantity);
    }
    console.log('el numero total de items es ' + this.totalItems);
  }
}
