import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../services/item.service';
import { FiltroItem } from '../../../models/filtros-item';
import { Item } from '../../../models/item';

declare var $: any;

@Component({
  selector: 'filtros-matisses',
  templateUrl: 'filtros.html',
  styleUrls: ['filtros.component.css'],
  providers: [ItemService]
})

export class FiltrosComponent {
  public filtrosDisponibles: Map<String, Array<any>>;
  public filtrosAplicados: Array<string[]>;
  public queryParams: Map<string, string>;
  private queryString: string;
  private availableFields: string[];
  public viewHasLoaded: boolean = false;
  public minPrice: number;
  public maxPrice: number;
  public totalItems: number = 0;

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router) {
    this.filtrosDisponibles = new Map<String, Array<any>>();
    this.filtrosAplicados = new Array<string[]>();
    this.availableFields = [];
  }

  public inicializarFiltros(availableFields, queryParams, queryString, totalItems) {
    this.totalItems = totalItems;
    this.availableFields = availableFields;
    this.queryParams = queryParams;
    if (this.queryParams.has('minPrice')) {
      this.minPrice = parseInt(this.queryParams.get('minPrice'));
    }
    if (this.queryParams.has('maxPrice')) {
      this.maxPrice = parseInt(this.queryParams.get('maxPrice'));
    }
    this.queryString = queryString;
    this._itemService.updateFilters(queryString).subscribe(
      response => {
        this.filtrosDisponibles = this.quitarDuplicados(response.result);
        this.configurarFiltrosActivos();
        this.viewHasLoaded = true;
      }, error => {
        console.error(error);
      }
    );
  }

  private quitarDuplicados(values: Map<String, Array<any>>) {
    if (!values || values.size === 0) {
      return new Map<String, Array<any>>();
    }

    if (values['groups']) {
      values['groups'] = values['groups'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    if (values['subgroups']) {
      values['subgroups'] = values['subgroups'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    if (values['brands']) {
      values['brands'] = values['brands'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    if (values['collection']) {
      values['collection'] = values['collection'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    if (values['colors']) {
      values['colors'] = values['colors'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    if (values['materials']) {
      values['materials'] = values['materials'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    return values;
  }

  private configurarFiltrosActivos() {
    this.filtrosAplicados = new Array<string[]>();
    for (let i = 0; i < this.availableFields.length; i++) {
      if (this.queryParams.has(this.availableFields[i])) {
        switch (this.availableFields[i]) {
          case 'group':
            let list = this.queryParams.get(this.availableFields[i]).split(',');
            for (let j = 0; j < list.length; j++) {
              this._itemService.findType('grupo', '?fieldValue=' + list[j]).subscribe(
                response => {
                  if (response.result && response.result[0][this.availableFields[i]].code) {
                    this.filtrosAplicados.push(['Grupo', response.result[0][this.availableFields[i]].name, 'group', response.result[0][this.availableFields[i]].code]);
                  }
                }, error => {
                  console.error(error);
                }
              );
            }
            break;
          case 'subgroup':
            this._itemService.findType('subgrupo', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result.length > 0) {
                  for (let k = 0; k < response.result.length; k++) {
                    if (response.result[k].code) {
                      this.filtrosAplicados.push(['Subgrupo', response.result[k].name, 'subgroup', response.result[k].code]);
                    }
                  }
                }
              }, error => {
                console.error(error);
              }
            );
            break;
          case 'brand':
            this._itemService.findType('marca', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result[0].code) {
                  this.filtrosAplicados.push(['Marca', response.result[0].name, 'brand', response.result[0].code]);
                }
              }, error => {
                console.error(error);
              }
            );
            break;
          case 'color':
            this._itemService.findType('color', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result[0].code) {
                  this.filtrosAplicados.push(['Color', response.result[0].name, 'color', response.result[0].code]);
                }
              }, error => {
                console.error(error);
              }
            );
            break;
          case 'material':
            this._itemService.findType('material', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result[0].code) {
                  this.filtrosAplicados.push(['Material', response.result[0].name, 'material', response.result[0].code]);
                }
              }, error => {
                console.error(error);
              }
            );
            break;
          case 'minPrice':
            this.filtrosAplicados.push(['Precio mínimo', '$ desde ' + this.queryParams.get('minPrice'), 'minPrice']);
            break;
          case 'maxPrice':
            this.filtrosAplicados.push(['Precio máximo', '$ hasta ' + this.queryParams.get('maxPrice'), 'maxPrice']);
            break;
          case 'collection':
            this.filtrosAplicados.push(['Colección', this.queryParams.get('collection'), 'collection', this.queryParams.get('collection')]);
            break;
          case 'keywords':
            this.filtrosAplicados.push(['Palabras Claves', this.queryParams.get('keywords'), 'keywords', this.queryParams.get('keywords')]);
            break;
          default:
          //y sino?
        }
      }
    }
  }

  private configurarColoresPreview() {
    for (let i = 0; i < this.availableFields['colors'].length; i++) {
      //TODO: configurar hexa a los colores genericos
      //$('#preview_' + this.availableFields['colors'][i].code).css('background-color', this.availableFields['colors'][i].hexa);
    }
  }

  public toggleClass(idComponent) {
    $(idComponent).toggleClass("icon-plus icon-minus");
  }

  public toggleSelection(tipoFiltro: string, codigo: string) {
    if (tipoFiltro.endsWith('Price')) {
      if (!codigo || codigo == null || codigo.length === 0) {
        if (this.queryParams.has(tipoFiltro)) {
          this.queryParams.delete(tipoFiltro);
        }
      } else {
        this.queryParams.set(tipoFiltro, codigo);
      }
    } else if (this.queryParams.has(tipoFiltro)) {
      let listStr: string = this.queryParams.get(tipoFiltro);
      let list: Array<string> = listStr.split(',');
      let pos = list.indexOf(codigo);
      if (pos >= 0) {
        list.splice(pos, 1);
        if (list.length > 0) {
          this.queryParams.set(tipoFiltro, list.join());
        } else {
          this.queryParams.delete(tipoFiltro);
        }
      } else {
        listStr = listStr.concat(',').concat(codigo);
        this.queryParams.set(tipoFiltro, listStr);
      }
    } else {
      this.queryParams.set(tipoFiltro, codigo);
    }
    this.navigate();
  }

  private navigate() {
    let queryParamsObj = {};
    for (let i = 0; i < this.availableFields.length; i++) {
      let key = this.availableFields[i];
      queryParamsObj[key] = this.queryParams.get(key);
    }
    queryParamsObj['page'] = '1';
    this._router.navigate(['/categoria'], { queryParams: queryParamsObj });
  }

  public isSelected(tipoFiltro, codigo) {
    return this.queryParams.has(tipoFiltro) && this.queryParams.get(tipoFiltro) === codigo;
  }

  public listActiveFilters() {
    let keys = [];
    for (var i = 0; i < this.availableFields.length; i++) {
      if (this.queryParams.has(this.availableFields[i])) {
        keys.push(this.availableFields[i]);
      }
    }
    return keys;
  }

  public toggleFiltros(idBloque) {
    let maxHeight = this.filtrosDisponibles[idBloque].length * 17;
    let actualHeightStr = document.getElementById(idBloque).style.height;
    let actualHeight = actualHeightStr ? parseInt(actualHeightStr.substring(0, actualHeightStr.length - 2)) : 0;

    if (actualHeight < maxHeight) {
      document.getElementById(idBloque).style.height = maxHeight + "px";
    } else {
      document.getElementById(idBloque).style.height = "200px";
    }
  }

  public showCategoryOption(menuItem) {
    return !this.queryParams.has('group') || this.queryParams.get('group').split(',').indexOf(menuItem.code) == -1;
  }
}
