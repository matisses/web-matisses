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
      this.items.push(new Item().newItem('item 1','12345',89000));
      this.items.push(new Item().newItem('item 2','0000',4000));
      this.items.push(new Item().newItem('item 3','55887',56000));
      this.items.push(new Item().newItem('item 4','546',15000));
      this.items.push(new Item().newItem('item 5','8845',5000));
      this.items.push(new Item().newItem('item 6','12345',89000));
      this.items.push(new Item().newItem('item 7','0000',4000));
      this.items.push(new Item().newItem('item 8','55887',56000));
      this.items.push(new Item().newItem('item 9','546',15000));
      this.items.push(new Item().newItem('item 10','8845',5000));
    }
}
