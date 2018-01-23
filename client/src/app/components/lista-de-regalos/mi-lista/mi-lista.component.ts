import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'mi-lista.html',
  styleUrls: ['mi-lista.component.css'],
  providers: [ItemService]
})

export class MiListaComponent implements OnInit {
  public nombreUsuario: string;
  public claveNueva: string;
  public claveConfirmacion: string;
  public messageError: string;
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {
    this.nombreUsuario = localStorage.getItem('username-lista');
  }

  ngOnInit() {
    if (localStorage.getItem('cambio-clave') == 'si') {
      $('#cambioContraseña').modal('show');
    }
  }


  ngAfterViewInit() {
    this.inicializarItems();
  }

  public actualizarClave() {


  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('2280058').subscribe( // Item 1
      response => {
        this.items.push(response.result[0]);
      }, error => { console.error(); }
    );
  }

}
