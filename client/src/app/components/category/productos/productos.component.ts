import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

@Component({
  selector: 'productos-matisses',
  templateUrl: 'productos.html',
  styleUrls: ['productos.component.css'],
  providers: [ItemService]
})

export class ProductosComponent implements OnInit {
  public totalItems: number;
  public activePage: number;
  public itemsXPag: string;
  public orderByStr: string;
  public pages: Array<number>;
  public items: Array<Item>;
  public queryParams: Map<string, string>;

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router) {
    this.queryParams = new Map<string, string>();
    this.itemsXPag = '12 x pag';
    this.orderByStr = 'Similares';
    this.pages = new Array<number>();
  }

  ngOnInit() {
    this.cargarItems();
  }

  private cargarItems() {
    this.items = new Array<Item>();
    this._route.queryParams.forEach((params: Params) => {
      this.inicializarMapa(params);
      let queryString = this.construirQueryString();
      this._itemService.filter(queryString).subscribe(
        response => {
          console.log(response);
          this.items = response.result;
          this.totalItems = response.records;
          this.pages = new Array<number>();
          if (this.queryParams.has('pageSize')) {
            if (this.queryParams.get('pageSize') === '10000') {
              this.itemsXPag = 'Todos';
            } else {
              this.itemsXPag = this.queryParams.get('pageSize') + ' x pag';
            }
          }
          if (this.queryParams.has('orderBy')) {
            switch (this.queryParams.get('orderBy')) {
              case 'price':
                this.orderByStr = 'Precio: <span class="glyphicon glyphicon-sort-by-order"></span> ';
                break;
              case '-price':
                this.orderByStr = 'Precio: <span class="glyphicon glyphicon-sort-by-order-alt"></span> ';
                break;
              case 'itemname':
                this.orderByStr = 'Nombre: <span class="glyphicon glyphicon-sort-by-alphabet"></span> ';
                break;
              case '-itemname':
                this.orderByStr = 'Nombre: <span class="glyphicon glyphicon-sort-by-alphabet-alt"></span> ';
                break;
              default:
                this.orderByStr = 'Similares';
            }
          } else {
            this.orderByStr = 'Similares';
          }
          this.activePage = parseInt(this.queryParams.has('page') ? this.queryParams.get('page') : '1');
          let pageSize = parseInt(this.queryParams.has('pageSize') ? this.queryParams.get('pageSize') : '12');
          let totalPages = Math.ceil(this.totalItems / pageSize);
          if (this.activePage > totalPages || this.activePage <= 0) {
            this.activePage = 1;
          }

          let initialPage;
          if (this.activePage > 3) {
            if (this.activePage + 2 <= totalPages) {
              initialPage = this.activePage - 2;
            } else {
              initialPage = totalPages - 3;
            }
          } else {
            initialPage = 1;
          }
          for (let i = initialPage; i <= totalPages && i - initialPage < 5; i++) {
            this.pages.push(i);
          }
        },
        error => {
          console.error(error);
        }
      );
    });
  }

  private inicializarMapa(params: Params) {
    this.queryParams = new Map<string, string>();
    if (params['orderBy']) {
      this.queryParams.set('orderBy', params['orderBy']);
    }
    if (params['department']) {
      this.queryParams.set('department', params['department']);
    }
    if (params['group']) {
      this.queryParams.set('group', params['group']);
    }
    if (params['subgroup']) {
      this.queryParams.set('subgroup', params['subgroup']);
    }
    if (params['page']) {
      this.queryParams.set('page', params['page']);
    }
    if (params['pageSize']) {
      this.queryParams.set('pageSize', params['pageSize']);
      if (params['pageSize'] === '10000') {
        this.itemsXPag = 'Todos';
      } else {
        this.itemsXPag = params['pageSize'] + ' x pag';
      }
    }
  }

  private construirQueryString() {
    let queryString = '?';
    if (this.queryParams.has('department')) {
      queryString += 'department=' + this.queryParams.get('department');
    }
    if (this.queryParams.has('orderBy')) {
      if (queryString.charAt(queryString.length - 1) != '?') {
        queryString += '&';
      }
      queryString += 'orderBy=' + this.queryParams.get('orderBy');
    }
    if (this.queryParams.has('group')) {
      if (queryString.charAt(queryString.length - 1) != '?') {
        queryString += '&';
      }
      queryString += 'group=' + this.queryParams.get('group');
    }
    if (this.queryParams.has('subgroup')) {
      if (queryString.charAt(queryString.length - 1) != '?') {
        queryString += '&';
      }
      queryString += 'subgroup=' + this.queryParams.get('subgroup');
    }
    if (this.queryParams.has('page')) {
      if (queryString.charAt(queryString.length - 1) != '?') {
        queryString += '&';
      }
      queryString += 'page=' + this.queryParams.get('page');
    }
    if (this.queryParams.has('pageSize')) {
      if (queryString.charAt(queryString.length - 1) != '?') {
        queryString += '&';
      }
      queryString += 'pageSize=' + this.queryParams.get('pageSize');
    }
    return queryString;
  }

  private navigate() {
    let queryParamsObj = {
      page: this.queryParams.get('page'),
      pageSize: this.queryParams.get('pageSize'),
      department: this.queryParams.get('department'),
      group: this.queryParams.get('group'),
      subgroup: this.queryParams.get('subgroup'),
      orderBy: this.queryParams.get('orderBy')
    };
    this._router.navigate(['/categoria'], { queryParams: queryParamsObj });
  }

  public cambiarTamanoPagina(tamano) {
    this.queryParams.set('pageSize', tamano);
    this.queryParams.set('page', '1');
    this.navigate();
  }

  public irAPagina(pagina) {
    this.queryParams.set('page', pagina);
    this.navigate();
  }

  public changeOrder(orderkey) {
    this.queryParams.set('orderBy', orderkey);
    this.navigate();
  }
}
