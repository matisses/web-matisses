import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'promocion-alf.html',
  styleUrls: ['promocion-alf.component.css'],
  providers: [ItemService]
})

export class PromocionAlfComponent implements OnInit {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('2440012').subscribe(
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('2440001').subscribe(
          response => {
            this.items.push(response.result[0]);
          }, error => { console.error(); }
        );
      }, error => { console.error(); }
    );
  }

}
