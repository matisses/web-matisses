import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../../services/item.service';
import { Item } from '../../../../models/item';

import { SessionUsuarioService } from '../../../../services/session-usuario.service';
import { ListaRegalosService } from '../../../../services/lista-regalos.service';
import { Logs } from 'selenium-webdriver';

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
  public msjAgradecimiento: string;
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
    this.fechaEvento = localStorage.getItem('formatoFechaEvento');
    this.idListaUsuario = localStorage.getItem('id-lista');
    this.msjAgradecimiento = localStorage.getItem('msjAgradecimiento');
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
    this.fechaEvento = localStorage.getItem('formatoFechaEvento');
    this.idListaUsuario = localStorage.getItem('id-lista');
    this.msjAgradecimiento = localStorage.getItem('msjAgradecimiento');

    this.cargarInvitados();
  }

  ngAfterViewInit() {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('formatoFechaEvento');
    this.idListaUsuario = localStorage.getItem('id-lista');
  }

  public abrirModal(modal: string) {
    this.limpiarCampos();
    $(modal).modal('show');
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
        asistencia: false//Se inserta false hasta que el invitado confirme asistencia via mail
      }
      this._listaService.crearInvitado(invitadoDTO).subscribe(
        response => {
          if (response.codigo == 0) {
            this.messageExit = 'Invitación enviada satisfactoriamente.';
            $("#modalInvitado").modal("hide");
            this.limpiarCampos();
            this.cargarInvitados();
          } else {
            this.messageError = response.mensaje;
          }
        },
        error => {
          this.messageError = ('Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.');
          console.error(error);
        }
      );
    }
  }

  public generar(link: string) {
    setTimeout(function () {
      window.open(link);
    }, 1000);
  }

  public imprimirLista() {
    if (this.totalInvitados > 0) {
      let documento = 'invitados';
      this._listaService.generarDocumento(documento, this.codigoLista).subscribe(
        response => {
          if (response) {
            this.generar(response);
          } else {
            this.messageError = 'Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.';
          }
        },
        error => { console.error(error) });
    }
  }

  public cargarInvitados() {
    this.invitados = new Array<any>();
    this._listaService.consultarInvitados(this.idListaUsuario).subscribe(
      response => {
        if (response.length > 0) {
          this.totalInvitados = response.length;
          for (let i = 0; i < response.length; i++) {
            let assistance;
            if (!response[i].asistencia) {
              assistance = 'Por confirmar';
            } else {
              assistance = 'Confirmado';
            }

            this.invitados.push({
              nombre: response[i].nombreInvitado + ' ' + response[i].apellidosInvitado,
              correo: response[i].correoInvitado,
              celular: response[i].telefonoInvitado,
              asistencia: assistance
            });
          }
        }
      }, error => { console.error(error); }
    );
  }

  public modificarMensaje() {
    let listaDTO = {
      codigo: this.codigoLista,
      mensajeAgradecimiento: this.msjAgradecimiento
    }

    this._listaService.modificarMensajeAgradecimiento(listaDTO).subscribe(
      response => {
        if (response) {
          $("#modalMsjAgradecimiento").modal("hide");
          this.msjAgradecimiento = listaDTO.mensajeAgradecimiento;
        } else {
          this.messageError = "Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.";
        }
      },
      error => { console.error(error); }
    );
  }

  public limpiarCampos() {
    this.messageError = '';
    this.nombreInvitado = null;
    this.apellidosInvitado = null;
    this.correoInvitado = null;
    this.telefonoInvitado = null;
    $('#form_registrar_invitado').trigger("reset");
  }

  public cerrarSession() {
    localStorage.removeItem('matisses.lista-token');
    localStorage.removeItem('username-lista');
    localStorage.removeItem('usuario-id');
    localStorage.removeItem('cambio-clave');
    localStorage.removeItem('id-lista');
    localStorage.removeItem('codigo-lista');
    localStorage.removeItem('fecha-evento');
    this._router.navigate(['/lista-de-regalos']);
  }

  public verificarArchivoMasivo(event) {
    let fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      let file: File = fileList[0];
      let fileSize: number = fileList[0].size;
      let fileType: string = fileList[0].type;

      if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        let formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('codigo', this.codigoLista);

        this._listaService.subirArchivoMasivo(formData).subscribe(
          response => {
            if (response) {
              $("#modalInvitado").modal("hide");
              this.limpiarCampos();
              this.cargarInvitados();
            } else {
              this.messageError = "Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.";
            }
          },
          error => {
            console.error(error);
            $("#modalInvitado").modal("hide");
            this.limpiarCampos();
            this.cargarInvitados();
          }
        );
      } else {
        this.messageError = 'El archivo solo puede ser formato .xlsx'
      }
    }
  }
}