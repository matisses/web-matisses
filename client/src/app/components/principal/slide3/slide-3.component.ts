import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'slide-3',
  templateUrl: 'slide-3.html',
  styleUrls: ['slide-3.component.css'],
  providers: [ItemService]
})

export class Slide3Component implements OnInit {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('2240161').subscribe(
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('2260220').subscribe(
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('2270114').subscribe(
              response => {
                this.items.push(response.result[0]);
              }, error => { console.error(); }
            );
          }, error => { console.error(); }
        );
      }, error => { console.error(); }
    );
  }

  public formatNumber(num:number) {

    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
}
