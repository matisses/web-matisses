import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FiltroItem } from '../../../models/filtros-item';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'filtros-matisses',
  templateUrl: 'filtros.html',
  styleUrls: ['filtros.component.css']
})

export class FiltrosComponent implements OnInit, AfterViewInit {
  public title: string;
  public menuItems: Array<FiltroItem>;
  public marcaItems: Array<FiltroItem>;
  public materialesItems: Array<FiltroItem>;
  public colorItems: Array<FiltroItem>;
  public filtrosActivos: Map<String, Array<String>>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo de los filtros';
    this.filtrosActivos = new Map<String, Array<String>>();
  }

  ngOnInit() {
    console.log('inicializando componente de filtros');
    this.inicializarFiltrosDeMenu();
    this.inicializarFiltrosDeMarca();
    this.inicializarFiltrosDeMateriales();
    this.inicializarFiltrosDeColores();
  }

  ngAfterViewInit() {
    this.configurarColoresPreview();
  }

  private inicializarFiltrosDeMenu() {
    this.menuItems = new Array();

    this.menuItems.push(new FiltroItem().newMenuItem('01', 'Caminos de mesa'));
    this.menuItems.push(new FiltroItem().newMenuItem('02', 'Condimenteros'));
    this.menuItems.push(new FiltroItem().newMenuItem('03', 'Delantales'));
    this.menuItems.push(new FiltroItem().newMenuItem('04', 'Individuales'));
    this.menuItems.push(new FiltroItem().newMenuItem('05', 'Posavasos'));
    this.menuItems.push(new FiltroItem().newMenuItem('06', 'Recipientes'));
    this.menuItems.push(new FiltroItem().newMenuItem('07', 'Salseros'));
    this.menuItems.push(new FiltroItem().newMenuItem('08', 'Servilleteros'));
  }

  private inicializarFiltrosDeMarca() {
    this.marcaItems = new Array();

    this.marcaItems.push(new FiltroItem().newMarcaItem('01', 'Eva Solo'));
    this.marcaItems.push(new FiltroItem().newMarcaItem('02', 'Vista Alegre'));
    this.marcaItems.push(new FiltroItem().newMarcaItem('03', 'WMF'));
    this.marcaItems.push(new FiltroItem().newMarcaItem('04', 'Boska'));
    this.marcaItems.push(new FiltroItem().newMarcaItem('05', 'Voluspa'));
  }

  private inicializarFiltrosDeMateriales() {
    this.materialesItems = new Array();

    this.materialesItems.push(new FiltroItem().newMaterialesItem('01', 'Porcelana'));
    this.materialesItems.push(new FiltroItem().newMaterialesItem('02', 'ceramica'));
    this.materialesItems.push(new FiltroItem().newMaterialesItem('03', 'Aluminio'));
    this.materialesItems.push(new FiltroItem().newMaterialesItem('04', 'Cera'));
    this.materialesItems.push(new FiltroItem().newMaterialesItem('05', 'Cuero'));
  }

  private inicializarFiltrosDeColores() {
    this.colorItems = new Array();

    this.colorItems.push(new FiltroItem().newColorItem('01', 'rojo', '#FF0000'));
    this.colorItems.push(new FiltroItem().newColorItem('02', 'verde', '#033c11'));
    this.colorItems.push(new FiltroItem().newColorItem('03', 'Azul', '#1c2adf'));
    this.colorItems.push(new FiltroItem().newColorItem('04', 'violeta', '#9600ff'));
    this.colorItems.push(new FiltroItem().newColorItem('05', 'morado', '#FF0000'));
  }

  private configurarColoresPreview() {
    for (let i = 0; i < this.colorItems.length; i++) {
      $('#preview_' + this.colorItems[i].codigo).css('background-color', this.colorItems[i].hexa);
    }
  }

  public toggleClass(idComponent) {
    $(idComponent).toggleClass("icon-plus icon-minus");
  }

  public toggleSelection(tipoFiltro, codigo) {
    if (this.filtrosActivos.has(tipoFiltro)) {
      let existe = 0;
      for (let i = 0; i < this.filtrosActivos.get(tipoFiltro).length; i++) {
        if (this.filtrosActivos.get(tipoFiltro)[i] === codigo) {
          break;
        }
        existe++;
      }
      if (existe < this.filtrosActivos.get(tipoFiltro).length) {
        //quitarlo
        let codigos = this.filtrosActivos.get(tipoFiltro);
        codigos.splice(existe, 1);
        this.filtrosActivos.set(tipoFiltro, codigos);
      } else {
        //agregarlo
        this.filtrosActivos.get(tipoFiltro).push(codigo);
      }
    } else {
      let codigos = new Array<String>();
      codigos.push(codigo);
      this.filtrosActivos.set(tipoFiltro, codigos);
    }
    console.log(this.filtrosActivos);
  }

  public isSelected(tipoFiltro, codigo) {
    return this.filtrosActivos.has(tipoFiltro) && this.filtrosActivos.get(tipoFiltro).indexOf(codigo) >= 0;
  }
}
