import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

import { Item } from '../../models/item';

import { ItemService } from '../../services/item.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

@Component({
  selector: 'matisses-header',
  templateUrl: 'header.html',
  styleUrls: ['header.component.css'],
  providers: [ItemService]
})

export class HeaderComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  public carrito: CarritoSimpleComponent;
  public lastAddedItem: Item;
  public itemsSinSaldo: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {
    this.itemsSinSaldo = new Array<Item>();
  }

  ngOnInit() {
    $('#carritoModal').on('show.bs.modal', () => {
      this.cargarInfoModal();
    });

    $('#modalSinSaldo').on('show.bs.modal', () => {
      this.cargarInfoModal();
    });

    this.validarSaldoCarrito();
  }

  public cargarInfoModal() {
    this.carrito.cargarCarrito();
    this.lastAddedItem = JSON.parse(localStorage.getItem('matisses.lastAddedItem'));
    localStorage.removeItem('matisses.lastAddedItem');
  }

  private validarSaldoCarrito() {
    this.carrito.cargarCarrito();
    let items = this.carrito.shoppingCart.items;

    for (let i = 0; i < items.length; i++) {
      this._itemService.find(items[i].shortitemcode).subscribe(
        response => {
          if (response.result[0].availablestock < items[i].selectedQuantity) {
            response.result[0].selectedQuantity = items[i].selectedQuantity;
            this.itemsSinSaldo.push(response.result[0]);
          }
          if (i === items.length - 1) {
            if (this.itemsSinSaldo.length > 0) {
              $('#modalItemsSinSaldo').modal('show');
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  private cargarItemSinSaldo() {
    this.itemsSinSaldo = JSON.parse(localStorage.getItem('matisses.itemsWithoutStock'));
    localStorage.removeItem('matisses.itemsWithoutStock');
  }
}
