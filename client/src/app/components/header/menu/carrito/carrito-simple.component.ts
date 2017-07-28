import { Component  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../../../models/item';

@Component({
  selector: 'matisses-carrito-simple',
  template: `<span style="display: none">este es el componenete de funcionalidad de carrito</span>`
})

export class CarritoSimpleComponent {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.items = new Array<Item>();
  }

  public cargarCarrito() {
    console.log('cargando carrito de localstorage');
    //consultar localstorage
    this.items = JSON.parse(localStorage.getItem('matisses.carrito'));
    console.log(this.items);
  }

  public procesarItem(item: Item) {
    console.log('procesando item')
    console.log(item);
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
    console.log(new Date().getTime());
    this._router.navigate(['/redirect',this._router.url]);
  }
}
