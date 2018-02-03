import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'slide-4',
  templateUrl: 'slide-4.html',
  styleUrls: ['slide-4.component.css'],
  providers: [ItemService]
})

export class Slide4Component implements OnInit {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('2090103').subscribe(
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('2090109').subscribe(
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('2440081').subscribe(
              response => {
                this.items.push(response.result[0]);
              }, error => { console.error(); }
            );
          }, error => { console.error(); }
        );
      }, error => { console.error(); }
    );
  }
}
