import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'slide-5',
  templateUrl: 'slide-5.html',
  styleUrls: ['slide-5.component.css'],
  providers: [ItemService]
})

export class Slide5Component implements OnInit {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('1280144').subscribe(
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('1280161').subscribe(
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('2540009').subscribe(
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
