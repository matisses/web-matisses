import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'recommended',
  templateUrl: 'recommended.html',
  styleUrls: ['recommended.component.css']
})

export class RecommendedComponent implements OnInit {
  public title: string;
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    console.log('inicializando componente de recomendados');
    this.inicializarItems();
  }

    private inicializarItems() {

      this.items = new Array<Item>();
      this.items.push(new Item().newItem('22400000000000000012', 'Chimenea el cual esta es una prueba', 95000));
      this.items.push(new Item().newItem('22400000000000000013', 'producto 2', 95000));
      this.items.push(new Item().newItem('22400000000000000014', 'producto 3', 952000));
      this.items.push(new Item().newItem('22400000000000000021', 'producto 4', 925000));
      this.items.push(new Item().newItem('22400000000000000039', 'producto 5', 395000));
      this.items.push(new Item().newItem('22400000000000000069', 'producto 6', 295000));
      this.items.push(new Item().newItem('22400000000000000084', 'producto 7', 195000));
      this.items.push(new Item().newItem('22400000000000000188', 'producto 8', 95000));
    }

    mostrarArticulo(articulo) {
      console.log(articulo);
    }

    public botonRight() {
      console.log('has dado click al botón right');
      $('.section').animate({scrollLeft : '+=890'}, 500);
      return false;
    }

    public botonLeft() {
      console.log('has dado click al botón right');
      $('.section').animate({scrollLeft : '-=890'}, 500);
      return false;
    }

}
