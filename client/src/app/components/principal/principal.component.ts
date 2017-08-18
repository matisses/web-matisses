import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
    selector: 'principal',
    templateUrl: 'home-principal.html',
    styleUrls: ['principal.component.css']
})

export class HomePrincipalComponent implements OnInit {
  public items: Array<Item>;


    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
      this.inicializarItems();
    }

    private inicializarItems(){

      this.items = new Array<Item>();

      this.items.push(new Item().newItem('24400000000000000066', 'Nombre de producto el cual puede tener mas de 30 caracteres', 3120000));
      this.items.push(new Item().newItem('24400000000000000047', 'Plato de postre', 3150000));

    }


}
