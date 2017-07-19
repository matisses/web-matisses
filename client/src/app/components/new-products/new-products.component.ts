import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';
import { ItemService } from '../../services/item.service';
//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'new-products',
  templateUrl: 'newproducts.html',
  providers: [ItemService],
  styleUrls: ['newproducts.component.css']
})

export class NewProductsComponent implements OnInit {
  public title: string;
  public items: Array<Item>;
  public articuloActivo: number = 1;

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    console.log('inicializando componente de nuevos productos');
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.listNewItems().subscribe(
      response => {
        if (response.result.length > 3) {
          let pos1 = (Math.random() * response.result.length) | 0;
          let pos2 = (Math.random() * response.result.length) | 0;
          let pos3 = (Math.random() * response.result.length) | 0;

          while (pos1 === pos2) {
            pos2 = (Math.random() * response.result.length) | 0;
          }
          while (pos1 === pos3 || pos2 == pos3) {
            pos3 = (Math.random() * response.result.length) | 0;
          }

          this.items.push(response.result[pos1]);
          this.items.push(response.result[pos2]);
          this.items.push(response.result[pos3]);
        } else {
          this.items = response.result;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  mostrarArticulo(articulo) {
    console.log(articulo);
  }

  public botonRight() {
    console.log('has dado click al botón right');
    $('.section').animate({ scrollLeft: '+=300' }, 500);
    return false;
  }

  public botonLeft() {
    console.log('has dado click al botón right');
    $('.section').animate({ scrollLeft: '-=300' }, 500);
    return false;
  }

}
