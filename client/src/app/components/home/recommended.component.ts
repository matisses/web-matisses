import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

@Component({
  selector: 'recommended',
  templateUrl: '../../views/recommended.html',
  styleUrls: ['../../../assets/css/recommended.component.css']
})

export class RecommendedComponent implements OnInit {
  public title: string;
  public items: Array<Item>;
  public articuloActivo: number = 1;
  //public items: Array<Array<Item>>;
  //public activePage: number = 0;

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
      this.items.push(new Item().newItem('22400000000000000013', 'producto 3', 95000));
      this.items.push(new Item().newItem('22400000000000000013', 'producto 4', 95000));
    }

    mostrarArticulo(articulo) {
      console.log(articulo);

    }

//  private inicializarItems() {
    //this.items = new Array<Array<Item>>();

    //let item1 = new Item().newItem('22400000000000000012', 'Chimenea el cual esta es una prueba', 95000);
    //let item2 = new Item().newItem('22400000000000000013', 'producto 2', 95000);
    //let item3 = new Item().newItem('22400000000000000014', 'producto 3', 95000);
    //let item4 = new Item().newItem('22400000000000000021', 'producto 4', 95000);
    //let pag1 = new Array<Item>();
    //pag1.push(item1);
    //pag1.push(item2);
    //pag1.push(item3);
    //pag1.push(item4);

    //let item5 = new Item().newItem('22400000000000000039', 'producto 5', 95000);
    //let item6 = new Item().newItem('22400000000000000069', 'producto 6', 95000);
    //let item7 = new Item().newItem('22400000000000000084', 'producto 7', 95000);
    //let item8 = new Item().newItem('22400000000000000188', 'producto 8', 95000);
    //let pag2 = new Array<Item>();
    //pag2.push(item5);
    //pag2.push(item6);
    //pag2.push(item7);
    //pag2.push(item8);

    //this.items.push(pag1);
    //this.items.push(pag2);

    //this.items.push(new RecommendedItem().newItem('01', 'chimenea el cual esta es una prueba', 89000));
    //this.items.push(new RecommendedItem().newItem('02', 'bbq ceramica', 400000));
    //this.items.push(new RecommendedItem().newItem('03', 'jarra aislante', 56000));
    //this.items.push(new RecommendedItem().newItem('04', 'carafe con neopreno', 56000));

//  }

  //cambiarPagina(pag) {
  //  console.log('cambiando a pagina ' + pag);
  //  if (pag < 0) {
  //    this.activePage = this.items.length - 1;
  //  } else if (pag > this.items.length - 1) {
  //    this.activePage = 0;
  //  } else {
  //    this.activePage = pag;
  //  }
  //  console.log('mostrando pagina ' + this.activePage);
  //}

}
