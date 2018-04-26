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
    let refs = ['2220169', '2220178', '2220322'];

    for (let i = 0; i < refs.length; i++) {
      this._itemService.find(refs[i]).subscribe(
        response => {
          this.items.push(response.result[0]);
        }, error => { console.error(); }
      );
    }
  }

}
