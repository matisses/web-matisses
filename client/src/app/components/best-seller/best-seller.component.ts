import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

@Component({
    selector: 'best-seller',
    templateUrl: 'best-seller.html',
    styleUrls: ['best-seller.component.css']
})

export class BestSellerComponent implements OnInit {
    public title: string;
    public items:Array<Item>;

    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
        console.log('inicializando componente de best seller ');
        this.inicializarItems();
    }

    private inicializarItems(){

      this.items = new Array<Item>();
      this.items.push(new Item().newItem('23100000000000000496', 'Nombre de producto el cual puede tener mas de 30 caracteres', 56000));
      this.items.push(new Item().newItem('23100000000000000495', 'Plato de postre', 56000));
      this.items.push(new Item().newItem('23100000000000000494', 'Plato de carga', 400000));
      this.items.push(new Item().newItem('23100000000000000493', 'Plato principal el cual esta es una prueba', 89000));
    }

}
