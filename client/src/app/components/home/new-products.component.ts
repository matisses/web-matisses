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
    public items:Array<Item>;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Nuevos productos';
    }

    ngOnInit() {
        console.log('inicializando componente de nuevos productos');
        this.inicializarItems();
    }

    private inicializarItems(){

      this.items = new Array<Item>();
      this.items.push(new Item().newItem('01', 'Plato principal el cual esta es una prueba', 89000));
      this.items.push(new Item().newItem('02', 'Plato de carga', 400000));
      this.items.push(new Item().newItem('03', 'Plato de postre', 56000));
    }
}
