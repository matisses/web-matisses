import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'slide-2',
  templateUrl: 'slide-2.html',
  styleUrls: ['slide-2.component.css'],
  providers: [ItemService]
})

export class Slide2Component implements OnInit {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('2310363').subscribe(
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('2310076').subscribe(
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('2240013').subscribe(
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
