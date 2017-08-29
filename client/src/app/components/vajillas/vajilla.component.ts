import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

declare var $: any;

@Component({
    templateUrl: 'vajilla.html',
    styleUrls: ['vajilla.component.css']
})

export class VajillaComponent implements OnInit {
    public title: string;
    public items:Array<Item>;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Modulo de vajillas';
    }

    ngOnInit() {
        this.inicializarItems();
    }

    private inicializarItems(){

      this.items = new Array<Item>();
      this.items.push(new Item().newItem('22600000000000000070', 'Domo Gold', 56000));
      this.items.push(new Item().newItem('22600000000000000071', 'Domo Platinum', 56000));
      this.items.push(new Item().newItem('22600000000000000072', 'Domo White', 400000));
      this.items.push(new Item().newItem('22600000000000000073', 'A la Plage', 89000));
    }

}
