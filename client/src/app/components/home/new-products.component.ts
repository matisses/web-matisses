import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

@Component({
  selector: 'new-products',
  templateUrl: '../../views/newproducts.html',
  styleUrls: ['../../../assets/css/newproducts.component.css']
})

export class NewProductsComponent implements OnInit {
  public title: string;
  public items: Array<Item>;
  public articuloActivo: number = 1;

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    console.log('inicializando componente de nuevos productos');
    this.inicializarItems();
  }

  private inicializarItems() {

    this.items = new Array<Item>();
    this.items.push(new Item().newItem('22600000000000000041', 'Plato principal el cual esta es una prueba', 89000));
    this.items.push(new Item().newItem('22600000000000000043', 'Plato de carga', 400000));
    this.items.push(new Item().newItem('22600000000000000044', 'Plato de postre', 56000));
  }

  mostrarArticulo(articulo) {
    console.log(articulo);

  }
}
