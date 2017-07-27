import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../services/item.service';
import { FiltroItem } from '../../../models/filtros-item';
import { Item } from '../../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'filtros-matisses',
  templateUrl: 'filtros.html',
  styleUrls: ['filtros.component.css'],
  providers: [ItemService]
})

export class FiltrosComponent implements AfterViewInit {
  public filtrosDisponibles: any;
  public queryParams: Map<string, string>;
  private queryString: string;
  private availableFields: string[];

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router) {
    this.filtrosDisponibles = new Map<String, Array<String>>();
  }

  ngAfterViewInit() {
    
  }

  public inicializarFiltros(availableFields, queryParams, queryString) {
    console.log('inicializando componente de filtros');
    this.availableFields = availableFields;
    this.queryParams = queryParams;
    this.queryString = queryString;
    this._itemService.updateFilters(queryString).subscribe(
      response => {
        this.filtrosDisponibles = response.result;
      },
      error => {
        console.error(error);
      }
    );
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

  public toggleSelection(tipoFiltro, codigo) {
    this.queryParams.set(tipoFiltro, codigo);
    this.navigate();
  }

  private navigate() {
    let queryParamsObj = {};
    for(let i = 0; i < this.availableFields.length; i++){
      let key = this.availableFields[i];
      queryParamsObj[key] = this.queryParams.get(key);
    }
    console.log(queryParamsObj);
    this._router.navigate(['/categoria'], { queryParams: queryParamsObj });
  }

  public isSelected(tipoFiltro, codigo) {
    return this.queryParams.has(tipoFiltro) && this.queryParams.get(tipoFiltro) === codigo;
  }

  public listActiveFilters(){
    let keys = [];
    for(var i = 0; i < this.availableFields.length; i++){
      if(this.queryParams.has(this.availableFields[i])){
        keys.push(this.availableFields[i]);
      }
    }
    return keys;
  }
}
