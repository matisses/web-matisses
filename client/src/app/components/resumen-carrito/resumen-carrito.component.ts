import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

import { Item } from '../../models/item';

@Component({
  selector: 'resumen-carrito',
  templateUrl: 'resumen-carrito.html',
  styleUrls: ['resumen-carrito.component.css']
})

export class ResumenCarritoComponent implements OnInit {
  public number: number = 34;
  public price: number = 4800000;
  public items:Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    console.log('inicializando componente de resumen carrito');
    this.inicializarItems();
  }

  public openResumen() {
    document.getElementById("resumen").style.height = "380px";
  }

  public closeResumen() {
    document.getElementById("resumen").style.height = "0";
  }

  private inicializarItems(){

    this.items = new Array<Item>();
    this.items.push(new Item().newItem('22400000000000000012', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
    this.items.push(new Item().newItem('22400000000000000013', 'Plato de postre', 56000));
    this.items.push(new Item().newItem('22400000000000000014', 'Plato de carga', 4000000));
    this.items.push(new Item().newItem('22400000000000000021', 'Plato principal el cual esta es una prueba', 89000));
  }

}
