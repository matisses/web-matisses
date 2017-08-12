import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

import { Item } from '../../models/item';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

@Component({
  selector: 'matisses-header',
  templateUrl: 'header.html',
  styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  public carrito: CarritoSimpleComponent;
  public lastAddedItem: Item;

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    $('#carritoModal').on('show.bs.modal', () => {
      this.cargarInfoModal();
    });
  }

  public cargarInfoModal() {
    this.carrito.cargarCarrito();
    this.lastAddedItem = JSON.parse(localStorage.getItem('matisses.lastAddedItem'));
    localStorage.removeItem('matisses.lastAddedItem');
  }
}
