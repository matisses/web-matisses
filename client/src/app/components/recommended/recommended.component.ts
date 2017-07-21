import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';
import { RecommendedItemService } from '../../services/recommended.service';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'recommended',
  templateUrl: 'recommended.html',
  styleUrls: ['recommended.component.css'],
  providers: [RecommendedItemService]
})

export class RecommendedComponent implements OnInit {
  public title: string;
  public items: Array<Item>;

  constructor(private _recommmendedService: RecommendedItemService, private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    console.log('inicializando componente de recomendados');
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();

    this._recommmendedService.list().subscribe(
      response => {
        for (let i = 0; i < response.result.length; i++) {
          this.items.push(response.result[i].itemId);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  mostrarArticulo(articulo) {
    console.log(articulo);
  }

  public botonRight() {
    console.log('has dado click al botón right');
    $('.section').animate({ scrollLeft: '+=890' }, 500);
    return false;
  }

  public botonLeft() {
    console.log('has dado click al botón right');
    $('.section').animate({ scrollLeft: '-=890' }, 500);
    return false;
  }
}
