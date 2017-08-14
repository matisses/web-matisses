import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ProductosComponent } from './productos/productos.component';
import { FiltrosComponent } from './filtros/filtros.component';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';

@Component({
  templateUrl: 'category.html',
  styleUrls: ['category.component.css'],
  providers: [ItemService]
})

export class CategoryComponent implements OnInit {
  @ViewChild(ProductosComponent)
  private productosComponent: ProductosComponent;
  @ViewChild(FiltrosComponent)
  private filtrosComponent: FiltrosComponent;

  public nombreGrupo: string;
  public nombreSubgrupo: string;
  public items: Array<Item>;
  public queryString: string;
  public queryParams: Map<string, string>;
  private availableFields: string[] = ['page', 'pageSize', 'orderBy', 'department', 'group', 'subgroup', 'color', 'minPrice', 'maxPrice', 'brand', 'material'];

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router) {
    this.queryParams = new Map<string, string>();
  }

  ngOnInit() {
    this.cargarItems();
  }

  private cargarItems() {
    this.items = new Array<Item>();
    this._route.queryParams.forEach((params: Params) => {
      this.inicializarMapa(params);
      this._itemService.filter(this.queryString).subscribe(
        response => {
          this.items = response.result;
          if(this.items && this.items.length > 0){
            if (this.queryParams.has('subgroup')) {
              //Inicializa el nombre del grupo y del subgrupo
              //this.nombreSubgrupo = this.items[0].subgroup.name;
              //this.nombreGrupo = this.items[0].group.name;
            } else if (this.queryParams.has('group')) {
              //Inicializa el nombre del grupo
              //this.nombreGrupo = this.items[0].group.name;
            }
            this.productosComponent.cargarItems(this.availableFields, this.items, this.queryParams, response.records);
            this.filtrosComponent.inicializarFiltros(this.availableFields, this.queryParams, this.queryString);
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
    this.queryString = '?';
    for (let i = 0; i < this.availableFields.length; i++) {
      let key = this.availableFields[i];
      if (params[key]) {
        this.queryParams.set(key, params[key]);
        if (this.queryString.charAt(this.queryString.length - 1) != '?') {
          this.queryString += '&';
        }
        this.queryString += key + '=' + this.queryParams.get(key);
      }
    }
  }

  public openFilter() {
    document.getElementById("myFilter").style.width = "100%";
  }

  public closeFilter() {
    document.getElementById("myFilter").style.width = "0%";
  }
}
