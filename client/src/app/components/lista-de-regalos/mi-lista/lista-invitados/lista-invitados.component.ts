import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../../services/item.service';
import { Item } from '../../../../models/item';

import { SessionUsuarioService } from '../../../../services/session-usuario.service';
import { ListaRegalosService } from '../../../../services/lista-regalos.service';

// declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'lista-invitados.html',
  styleUrls: ['lista-invitados.component.css'],
  providers: [ItemService, SessionUsuarioService, ListaRegalosService]
})

export class ListaInvitadosComponent implements OnInit, AfterViewInit {
  public totalInvitados: number;
  public nombreUsuario: string;
  public claveNueva: string;
  public claveConfirmacion: string;
  public messageError: string;
  public messageExit: string;
  public queryString: string;
  public successMessage: string;
  public idListaUsuario: string;
  public codigoLista: string;
  public fechaEvento: string;
  public nombreInvitado: string;
  public apellidosInvitado: string;
  public correoInvitado: string;
  public telefonoInvitado: string;
  public asistencia: boolean = true;
  public valid: boolean = true;
  public items: Array<Item>;
  public itemsListaBcs: Array<any>;
  public invitados: Array<any>;
  public queryParams: Map<string, string>;
  public verDetalle: any;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _userService: SessionUsuarioService, private _listaService: ListaRegalosService) {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.idListaUsuario = localStorage.getItem('id-lista');
    this.queryParams = new Map<string, string>();
    this.invitados = new Array<any>();

    this.totalInvitados = 0;
    this.nombreInvitado = '';
    this.apellidosInvitado = '';
    this.correoInvitado = '';
    this.telefonoInvitado = '';
    this.messageError = '';
    this.messageExit = '';
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

  public registrarInvitado() {
    if (this.nombreInvitado == null || this.nombreInvitado.length <= 0
      || this.apellidosInvitado == null || this.apellidosInvitado.length <= 0
      || this.correoInvitado == null || this.correoInvitado.length <= 0
      || this.telefonoInvitado == null || this.telefonoInvitado.length <= 0) {
      this.messageError = 'Debes llenar todos los campos obligatorios.';
      this.valid = false;
    } else {
      let invitadoDTO = {
        idLista: this.idListaUsuario,
        nombreInvitado: this.nombreInvitado.toUpperCase(),
        apellidosInvitado: this.apellidosInvitado.toUpperCase(),
        correoInvitado: this.correoInvitado.toUpperCase(),
        telefonoInvitado: this.telefonoInvitado.toUpperCase(),
        asistencia: false
      }
      this._listaService.crearInvitado(invitadoDTO).subscribe(
        response => {
          if (response.codigo == 0) {
            this.messageExit = 'Invitación enviada satisfatoriamente.';
            $("#modalInvitado").modal("hide");
            this.limpiarCampos();
            this.cargarInvitados();
          } else {
            this.messageError = ('Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.');
          }
        },
        error => {
          this.messageError = ('Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.');
          console.error(error);
        }
      );
    }
  }

  public cargarInvitados() {
    this.invitados = new Array<any>();
    this._listaService.consultarInvitados(this.idListaUsuario).subscribe(
      response => {
        if (response.length > 0) {
          this.totalInvitados = response.length;
          for (let i = 0; i < response.length; i++) {
            this.invitados.push({
              nombre: response[i].nombreInvitado + ' ' + response[i].apellidosInvitado,
              correo: response[i].correoInvitado,
              celular: response[i].telefonoInvitado,
              asistencia: "Por confirmar"
            });
          }
        }
      }, error => { console.error(error); }
    );
  }

  public limpiarCampos() {
    this.messageError = '';
    this.nombreInvitado = null;
    this.apellidosInvitado = null;
    this.correoInvitado = null;
    this.telefonoInvitado = null;
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
