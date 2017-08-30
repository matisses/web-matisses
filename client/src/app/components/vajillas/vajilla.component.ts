import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';

declare var $: any;

@Component({
    templateUrl: 'vajilla.html',
    styleUrls: ['vajilla.component.css'],
    providers: [ItemService]
})

export class VajillaComponent implements OnInit {
    public items:Array<Item>;
    public puesto:Array<Item>;

    constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {
    }

    ngOnInit() {
        this.inicializarItems();
        this.inicializarPuesto();
    }

    private inicializarItems(){

      this.items = new Array<Item>();
      this.items.push(new Item().newItem('1', 'Vajilla 4 puestos', 56000));
      this.items.push(new Item().newItem('2', 'Vajilla 4 puestos', 56000));
      this.items.push(new Item().newItem('3', 'Vajilla 4 puestos', 400000));
    }

    private inicializarPuesto() {
      this.puesto = new Array<Item>();
      this._itemService.find('2260041').subscribe(
        response => {
          this.puesto.push(response.result[0]);
          this._itemService.find('2260045').subscribe(
            response => {
              this.puesto.push(response.result[0]);
              this._itemService.find('2260043').subscribe(
                response => {
                  this.puesto.push(response.result[0]);
                  this._itemService.find('2260276').subscribe(
                    response => {
                      this.puesto.push(response.result[0]);
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
