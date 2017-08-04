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
  public filtrosDisponibles: Map<String, Array<any>>;
  public filtrosAplicados: Array<string[]>;
  public queryParams: Map<string, string>;
  private queryString: string;
  private availableFields: string[];

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router) {
    this.filtrosDisponibles = new Map<String, Array<any>>();
    this.filtrosAplicados = new Array<string[]>();
    this.availableFields = [];
  }

  ngAfterViewInit() {
    //this.configurarAlturaInicialFiltros();
  }

  public inicializarFiltros(availableFields, queryParams, queryString) {
    console.log('inicializando componente de filtros');
    this.availableFields = availableFields;
    this.queryParams = queryParams;
    this.queryString = queryString;
    this._itemService.updateFilters(queryString).subscribe(
      response => {
        this.filtrosDisponibles = response.result;
        this.configurarFiltrosActivos();
      }, error => {
        console.error(error);
      }
    );
  }

  private configurarAlturaInicialFiltros() {
    console.log('configurando altura por filtro');
    console.log(this.filtrosDisponibles['groups']);
    if (this.filtrosDisponibles['groups'] && this.filtrosDisponibles['groups'].length < 11) {
      //configura altura  dependiendo de # de opciones
      //document.getElementById(idBloque).style.height = (17*this.filtrosDisponibles[i].length) + "px";
    } else {
      //configura altura minima de 200px
      //document.getElementById("groups").style.height = "200px";
    }
    /*
        for (let i = 0; i < this.filtrosDisponibles.keys.length; i++) {
          console.log(this.filtrosDisponibles[i]);
          if(this.filtrosDisponibles[i].length < 11){
            //configura altura  dependiendo de # de opciones
            //document.getElementById(idBloque).style.height = (17*this.filtrosDisponibles[i].length) + "px";
          }else{
            //configura altura minima de 200px
            //document.getElementById(idBloque).style.height = "200px";
          }
        }
        */
  }

  private configurarFiltrosActivos() {
    this.filtrosAplicados = new Array<string[]>();
    for (let i = 0; i < this.availableFields.length; i++) {
      if (this.queryParams.has(this.availableFields[i])) {
        switch (this.availableFields[i]) {
          case 'group':
            this._itemService.findType('grupo', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result[0][this.availableFields[i]].code) {
                  this.filtrosAplicados.push(['Grupo', response.result[0][this.availableFields[i]].name, 'group']);
                }
              }, error => {
                console.error(error);
              }
            );
            break;
          case 'subgroup':
            this._itemService.findType('subgrupo', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result[0][this.availableFields[i]].code) {
                  this.filtrosAplicados.push(['Subgrupo', response.result[0][this.availableFields[i]].name, 'subgroup']);
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
                  this.filtrosAplicados.push(['Marca', response.result[0].name, 'brand']);
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
                  this.filtrosAplicados.push(['Color', response.result[0].name, 'color']);
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
                  this.filtrosAplicados.push(['Material', response.result[0].name, 'material']);
                }
              }, error => {
                console.error(error);
              }
            );
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

  public toggleSelection(tipoFiltro, codigo) {
    if (this.queryParams.has(tipoFiltro)) {
      this.queryParams.delete(tipoFiltro);
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
    console.log(queryParamsObj);
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
    console.log(actualHeight);
    /*if (actualHeight === null || typeof actualHeight === 'undefined'){
      actualHeight = 0;
    }*/
    if (actualHeight < maxHeight) {
      console.log('expandir');
      document.getElementById(idBloque).style.height = maxHeight + "px";
    } else {
      console.log('contraer');
      document.getElementById(idBloque).style.height = "200px";
    }

    /*if (document.getElementById(idBloque).style.height === '0%') {
      document.getElementById("myNav").style.width = "100%";
    } else {
      document.getElementById("myNav").style.width = "0%";
    }*/
  }

  /*public toggleFiltros(idComponent, class1, class2) {
    console.log('toggle idComponent: ' + idComponent + ', class1: ' + class1 + ', class2: ' + class2);
    $(idComponent).toggleClass(class1 + " " + class2);
  }*/

  /*public mostrarMas(){
    console.log('has dado click en más');
    $(".filtros-content").css('height', '400px');
  }*/

}
