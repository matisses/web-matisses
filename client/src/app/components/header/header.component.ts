import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

declare var $: any;

@Component({
  selector: 'matisses-header',
  templateUrl: 'header.html',
  styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit {
  public lastAddedItem: Item;
  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    console.log('configurando accion antes de mostrar modal');
    $('#carritoModal').on('show.bs.modal', () => {
      this.cargarInfoModal();
    });
  }

  public cargarInfoModal() {
    console.log('cargando info modal carrito');
    this.lastAddedItem = JSON.parse(localStorage.getItem('matisses.lastAddedItem'));
    console.log(this.lastAddedItem);
    localStorage.removeItem('matisses.lastAddedItem');
  }
}
