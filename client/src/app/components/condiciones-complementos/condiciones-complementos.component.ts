import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'condiciones-complementos.html',
  styleUrls: ['condiciones-complementos.component.css'],
  providers: [ItemService]
})

export class CondicionesComplementosAlfComponent implements OnInit {
  public itemscomplementos: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();
  }



  private inicializarItems() {
    this.itemscomplementos = new Array<Item>();
    let refs = ['2310153', '2310360', '2310398'];

    for (let i = 0; i < refs.length; i++) {
      this._itemService.find(refs[i]).subscribe(
        response => {
          this.itemscomplementos.push(response.result[0]);
        }, error => { console.error(); }
      );
    }
  }

  

}
