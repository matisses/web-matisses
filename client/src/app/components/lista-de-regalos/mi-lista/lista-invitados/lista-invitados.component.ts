import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../../services/item.service';
import { Item } from '../../../../models/item';

import { SessionUsuarioService } from '../../../../services/session-usuario.service';
import { ListaRegalosService } from '../../../../services/lista-regalos.service';




declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'lista-invitados.html',
  styleUrls: ['lista-invitados.component.css'],
  providers: [ItemService, SessionUsuarioService, ListaRegalosService]
})

export class ListaInvitadosComponent implements OnInit, AfterViewInit {
  public nombreUsuario: string;
  public claveNueva: string;
  public claveConfirmacion: string;
  public messageError: string;
  public items: Array<Item>;
  public queryParams: Map<string, string>;
  public queryString: string;
  public valid: boolean;
  public successMessage: string;
  public idListaUsuario: string;
  public codigoLista: string;
  public fechaEvento: string;
  public itemsListaBcs: Array<any>;
  public totalLista: number;
  public verDetalle: any;
  public invitados: Array<any>;


  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _userService: SessionUsuarioService, private _listaService: ListaRegalosService) {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.idListaUsuario = localStorage.getItem('id-lista');
    this.queryParams = new Map<string, string>();
    this.invitados = new Array<any>();
  }


  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.idListaUsuario = localStorage.getItem('id-lista');

    this.cargarInvitados();
  }


  ngAfterViewInit() {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.idListaUsuario = localStorage.getItem('id-lista');
  }

  public cargarInvitados(){
    this.invitados.push({
      nombre: "Rodrigo Guerra",
      correo: "jrgt7465@hotmail.com",
      celular: "3104462964",
      asistencia: "Por confirmar"
    });
    this.invitados.push({
      nombre: "Adriana Pareja",
      correo: "apl1127@hotmail.com",
      celular: "3218515320",
      asistencia: "Por confirmar"
    });
    this.invitados.push({
      nombre: "Jhordan Castrillon",
      correo: "jcastrillon@hotmail.com",
      celular: "3155326895",
      asistencia: "Por confirmar"
    });
  }

  public cerrarSession() {
    console.log('cerrar sesion');
    localStorage.removeItem('matisses.lista-token');
    localStorage.removeItem('username-lista');
    localStorage.removeItem('usuario-id');
    localStorage.removeItem('cambio-clave');
    localStorage.removeItem('id-lista');
    localStorage.removeItem('codigo-lista');
    localStorage.removeItem('fecha-evento');
    this._router.navigate(['/lista-de-regalos']);
  }

}
