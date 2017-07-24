import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FiltroItem } from '../../../models/filtros-item';

//declare var jquery: any;
declare var $: any;

@Component({
    selector: 'filtros-matisses',
    templateUrl: 'filtros.html',
    styleUrls: ['filtros.component.css']
})

export class FiltrosComponent implements OnInit {
    public title: string;
    public menuItems:Array<FiltroItem>;
    public marcaItems:Array<FiltroItem>;
    public materialesItems:Array<FiltroItem>;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo de los filtros';
    }

    ngOnInit() {
        console.log('inicializando componente de filtros');
        this.inicializarFiltrosDeMenu();
        this.inicializarFiltrosDeMarca();
        this.inicializarFiltrosDeMateriales();
    }

    private inicializarFiltrosDeMenu (){
      this.menuItems = new Array();

      this.menuItems.push(new FiltroItem().newMenuItem('','Caminos de mesa'));
      this.menuItems.push(new FiltroItem().newMenuItem('','Condimenteros'));
      this.menuItems.push(new FiltroItem().newMenuItem('','Delantales'));
      this.menuItems.push(new FiltroItem().newMenuItem('','Individuales'));
      this.menuItems.push(new FiltroItem().newMenuItem('','Posavasos'));
      this.menuItems.push(new FiltroItem().newMenuItem('','Recipientes'));
      this.menuItems.push(new FiltroItem().newMenuItem('','Salseros y Dispensadores'));
      this.menuItems.push(new FiltroItem().newMenuItem('','Servilleteros'));
    }

    private inicializarFiltrosDeMarca (){
      this.marcaItems = new Array();

      this.marcaItems.push(new FiltroItem().newMarcaItem('','Eva Solo'));
      this.marcaItems.push(new FiltroItem().newMarcaItem('','Vista Alegre'));
      this.marcaItems.push(new FiltroItem().newMarcaItem('','WMF'));
      this.marcaItems.push(new FiltroItem().newMarcaItem('','Boska'));
      this.marcaItems.push(new FiltroItem().newMarcaItem('','Voluspa'));
    }

    private inicializarFiltrosDeMateriales (){
      this.materialesItems = new Array();

      this.materialesItems.push(new FiltroItem().newMaterialesItem('','Porcelana'));
      this.materialesItems.push(new FiltroItem().newMaterialesItem('','ceramica'));
      this.materialesItems.push(new FiltroItem().newMaterialesItem('','Aluminio'));
      this.materialesItems.push(new FiltroItem().newMaterialesItem('','Cera'));
      this.materialesItems.push(new FiltroItem().newMaterialesItem('','Cuero'));
    }
}
