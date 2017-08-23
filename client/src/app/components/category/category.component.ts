import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ProductosComponent } from './productos/productos.component';
import { FiltrosComponent } from './filtros/filtros.component';
import { ItemService } from '../../services/item.service';
import { DescuentosService } from '../../services/descuentos.service';
import { Item } from '../../models/item';

declare var $: any;

@Component({
  templateUrl: 'category.html',
  styleUrls: ['category.component.css'],
  providers: [ItemService, DescuentosService]
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
  private availableFields: string[] = ['page', 'pageSize', 'orderBy', 'department', 'group', 'subgroup', 'color', 'minPrice', 'maxPrice', 'brand', 'material', 'collection', 'keywords'];

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router, private _descuentosService: DescuentosService) {
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
          for (let i = 0; i < this.items.length; i++) {
            //validar si el ítem tiene descuentos
            this._descuentosService.findDiscount(this.items[i].itemcode).subscribe(
              response => {
                if (this.items[i].priceaftervat === response.precio) {
                  if (response.descuentos && response.descuentos.length > 0) {
                    this.items[i].descuento = response.descuentos[0].porcentaje;
                    this.items[i].priceafterdiscount = this.items[i].priceaftervat - ((this.items[i].priceaftervat / 100) * this.items[i].descuento);
                  }
                }
              },
              error => {
                console.error(error);
              }
            );
          }
          this.productosComponent.cargarItems(this.availableFields, this.items, this.queryParams, response.records);
          this.filtrosComponent.inicializarFiltros(this.availableFields, this.queryParams, this.queryString, response.records);
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
    this.inicializarNombreGrupo();
  }

  private inicializarNombreGrupo() {
    this.nombreGrupo = '';
    if (this.queryParams.has('group')) {
      this._itemService.findType('grupo', '?fieldValue=' + this.queryParams.get('group')).subscribe(
        response => {
          try {
            this.nombreGrupo = response.result[0].group.name;

            //Cambiar imagen categoria
            console.log('cambiando clase');
            $('.img-category').css('background','url(/assets/images/categorias/' + response.result[0].group.code + '.jpg)');
          } catch (e) {
            console.error(e);
          }
        }, error => { console.error(error); }
      )
    }
  }

  public openFilter() {
    document.getElementById("myFilter").style.width = "100%";
  }

  public closeFilter() {
    document.getElementById("myFilter").style.width = "0%";
  }
}
