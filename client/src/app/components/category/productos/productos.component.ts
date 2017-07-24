import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../../models/item';

@Component({
    selector: 'productos-matisses',
    templateUrl: 'productos.html',
    styleUrls: ['productos.component.css']
})

export class ProductosComponent implements OnInit {
    public title: string;
    public items:Array<Item>;

    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
      console.log('inicializando componente de productos');
      this.inicializarItems();
    }

    private inicializarItems(){

      this.items = new Array<Item>();
      this.items.push(new Item().newItem('22600000000000000041', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
      this.items.push(new Item().newItem('22600000000000000043', 'Plato de postre', 56000));
      this.items.push(new Item().newItem('22600000000000000044', 'Plato de carga', 4000000));
      this.items.push(new Item().newItem('22600000000000000043', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
      this.items.push(new Item().newItem('22600000000000000041', 'Plato de postre', 56000));
      this.items.push(new Item().newItem('22600000000000000043', 'Plato de carga', 4000000));
      this.items.push(new Item().newItem('22600000000000000043', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
      this.items.push(new Item().newItem('22600000000000000041', 'Plato de postre', 56000));
      this.items.push(new Item().newItem('22600000000000000044', 'Plato de carga', 4000000));
      this.items.push(new Item().newItem('22600000000000000041', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
      this.items.push(new Item().newItem('22600000000000000043', 'Plato de postre', 56000));
      this.items.push(new Item().newItem('22600000000000000041', 'Plato de carga', 4000000));
    }


  }
