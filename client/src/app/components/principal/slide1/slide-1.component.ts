import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'slide-1',
  templateUrl: 'slide-1.html',
  styleUrls: ['slide-1.component.css'],
  providers: [ItemService]
})

export class Slide1Component implements OnInit {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('2290139').subscribe(
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('1970001').subscribe(
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('1330467').subscribe(
              response => {
                this.items.push(response.result[0]);
                this._itemService.find('1330184').subscribe(
                  response => {
                    this.items.push(response.result[0]);
                  }, error => { console.error(); }
                );
              }, error => { console.error(); }
            );
          }, error => { console.error(); }
        );
      }, error => { console.error(); }
    );
  }
}
