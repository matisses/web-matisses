import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../../services/global';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

import { SessionUsuarioService } from '../../../services/session-usuario.service';
import { ListaRegalosService } from '../../../services/lista-regalos.service';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'mi-lista.html',
  styleUrls: ['mi-lista.component.css'],
  providers: [ItemService, SessionUsuarioService, ListaRegalosService]
})

export class MiListaComponent implements OnInit {
  public nombreUsuario: string;
  public claveNueva: string;
  public claveConfirmacion: string;
  public messageError: string;
  public items: Array<Item>;
  public queryParams: Map<string, string>;
  public queryString: string;
  public valid: boolean;
  public successMessage: string;
  public totalItems: number;
  public activePage: number;
  public itemsXPag: string;
  public orderByStr: string;
  public pages: Array<number>;
  public keywords: string = '';
  public availableFields: string[] = ['page', 'pageSize', 'orderBy', 'department', 'group', 'subgroup', 'color', 'minPrice', 'maxPrice', 'brand', 'material', 'collection', 'keywords', 'discount'];
  public idListaUsuario: string;
  public codigoLista: string;
  public fechaEvento: string;
  public urlQr: string;
  public paramsConsulta: any;
  public itemsListaBcs: Array<any>;
  public totalLista: number;
  public verDetalle: any;
  public idListaUsuario1: number;
  public confirmEliminar: boolean = false;
  public formAgregar: any;
  public aceptaBono:boolean=true;
  public minimoBono: number=0;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _userService: SessionUsuarioService, private _listaService: ListaRegalosService) {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.idListaUsuario = localStorage.getItem('id-lista');

    this.totalLista = 0;
    this.urlQr = GLOBAL.urlShared + 'qr/';
    this.queryParams = new Map<string, string>();
    this.itemsXPag = '12 x pag';
    this.orderByStr = 'Similares';
    this.pages = new Array<number>();
    this.items = new Array<Item>();
    this.itemsListaBcs = new Array<any>();
    this.inicializarForm();

    this.inicializarParamsConsulta();
  }

  private inicializarParamsConsulta() {
    this.paramsConsulta = {
      idLista: localStorage.getItem('id-lista'),
      pagina: '1',
      registrosPagina: '11',
      orderBy: 'referencia asc',
      sortOrder: ''
    };
  }

  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.idListaUsuario = localStorage.getItem('id-lista');
    this.buscarLista(this.codigoLista);
    localStorage.setItem('fecha-evento', this.fechaEvento);
    localStorage.setItem('username-lista', this.nombreUsuario);
    this.cargarItems0();
  }

  ngAfterViewInit() {
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 30) {
        $(".contenedor").addClass("margin-top-scroll");
      } else {
        $(".contenedor").removeClass("margin-top-scroll")
      }
    });

    this.nombreUsuario = localStorage.getItem('username-lista');
    setTimeout(function() {
      if (localStorage.getItem('cambio-clave') == 'si') {
        $('#cambioContrasena').modal('show');
      }
    }, 500);
  }

  public confirmEliminarItem() {
    if (this.confirmEliminar) {
      this.confirmEliminar = false;
    } else {
      this.confirmEliminar = true;
    }
  }

  public actualizarClave() {
    this.messageError = '';
    if (this.claveNueva == null || this.claveNueva.length <= 0) {
      this.messageError = 'Ingresa la contraseña';
      this.valid = false;
      this.successMessage = '';
      return;
    }

    if (this.claveConfirmacion == null || this.claveConfirmacion.length <= 0 || this.claveConfirmacion == 'undefined') {
      this.messageError = 'Ingresa la confirmación de la contraseña.';
      this.valid = false;
      this.successMessage = '';
      return;
    }
    if (this.claveNueva != this.claveConfirmacion) {
      this.messageError = 'Ambas contraseñas deben ser iguales.';
      this.successMessage = '';
      return;
    }
    let usuarioDTO = {
      nombreUsuario: this.nombreUsuario,
      password: this.claveNueva,
      usuarioId: localStorage.getItem('usuario-id')
    }

    this._userService.updateUser(usuarioDTO).subscribe(
      response => {
        if (response.codigo == "0") {
          this.successMessage = '1';
          localStorage.removeItem('cambio-clave');
          localStorage.setItem('cambio-clave', 'no');
          $('#cambioContrasena').modal('hide');
          return;
        }
        else {
          this.messageError = 'Ocurrio un error al actualizar el usuario';
        }
      },
      error => {
        this.messageError = "Lo sentimos. Ocurrió un error inesperado, por favor inténtelo más tarde.";
        console.error(error);
      }
    );
  }

  public irAPagina(pagina) {
    this.queryParams.set('page', pagina);
    this.navigate();
  }

  public changeOrder(orderkey) {
    this.queryParams.set('orderBy', orderkey);
    this.queryParams.set('page', '1');
    this.navigate();
  }

  public cambiarTamanoPagina(tamano) {
    this.queryParams.set('pageSize', tamano);
    this.queryParams.set('page', '1');
    this.navigate();
  }

  private navigate() {
    let queryParamsObj = {};
    for (let i = 0; i < this.availableFields.length; i++) {
      let key = this.availableFields[i];
      queryParamsObj[key] = this.queryParams.get(key);
    }
    this._router.navigate(['/mi-lista'], { queryParams: queryParamsObj });
  }

  public cargarItems(availableFields, items, queryParams, records) {
    this.items = new Array<Item>();
    this.items = items;
    this.itemsListaBcs = items;
    this.availableFields = availableFields;
    this.queryParams = queryParams;
    this.totalItems = records;
    this.pages = new Array<number>();
    if (this.queryParams.has('pageSize')) {
      if (this.queryParams.get('pageSize') === '10000') {
        this.itemsXPag = 'Todos';
      } else {
        this.itemsXPag = this.queryParams.get('pageSize') + ' x pag';
      }
    }
    if (this.queryParams.has('orderBy')) {
      switch (this.queryParams.get('orderBy')) {
        case 'price':
          this.orderByStr = 'Precio: <span class="glyphicon glyphicon-sort-by-order"></span> ';
          break;
        case '-price':
          this.orderByStr = 'Precio: <span class="glyphicon glyphicon-sort-by-order-alt"></span> ';
          break;
        case 'itemname':
          this.orderByStr = 'Nombre: <span class="glyphicon glyphicon-sort-by-alphabet"></span> ';
          break;
        case '-itemname':
          this.orderByStr = 'Nombre: <span class="glyphicon glyphicon-sort-by-alphabet-alt"></span> ';
          break;
        default:
          this.orderByStr = 'Similares';
      }
    } else {
      this.orderByStr = 'Similares';
    }
    this.activePage = parseInt(this.queryParams.has('page') ? this.queryParams.get('page') : '1');
    let pageSize = parseInt(this.queryParams.has('pageSize') ? this.queryParams.get('pageSize') : '11');
    let totalPages = Math.ceil(this.totalItems / pageSize);
    if (this.activePage > totalPages || this.activePage <= 0) {
      this.activePage = 1;
    }

    let initialPage;
    if (this.activePage > 3) {
      if (this.activePage + 2 <= totalPages) {
        initialPage = this.activePage - 2;
      } else {
        initialPage = totalPages - 3;
      }
    } else {
      initialPage = 1;
    }
    for (let i = initialPage; i <= totalPages && i - initialPage < 5; i++) {
      this.pages.push(i);
    }
  }

  private cargarItems0() {
    this.items = new Array<Item>();
    this.inicializarParamsConsulta();

    this._route.queryParams.forEach((params: Params) => {
      this.inicializarMapa(params);
      if (this.queryParams.has('pageSize')) {
        this.paramsConsulta.registrosPagina = this.queryParams.get('pageSize');
      }

      if (this.queryParams.has('orderBy')) {
        switch (this.queryParams.get('orderBy')) {
          case '-price':
            this.paramsConsulta.orderBy = 'precio';
            break;
          case 'price':
            this.paramsConsulta.orderBy = 'precio asc';
            break;
          case '-itemname':
            this.paramsConsulta.orderBy = 'referencia';
            break;
          case 'itemname':
            this.paramsConsulta.orderBy = 'referencia asc';
            break;
          default:
            this.paramsConsulta.orderBy = '';
        }
      }
      if (this.queryParams.has('page')) {
        this.paramsConsulta.pagina = this.queryParams.get('page');
      }

      this._listaService.consultarTotalLista(this.idListaUsuario).subscribe(
        response => {
          this.totalLista = response;
        },
        error => { console.error(error); }
      );

      this._listaService.consultarListaPaginada(this.paramsConsulta).subscribe(
        response => {
          this.itemsListaBcs = response;

          this.cargarItems(this.availableFields, this.itemsListaBcs, this.queryParams, this.totalLista);
        },
        error => { console.error(error); }
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
  }

  public search() {
    if (this.keywords && this.keywords.length > 0) {
      let queryParamsObj = { keywords: this.keywords.replace(/ /g, ",") };
      this._router.navigate(['/mi-lista'], { queryParams: queryParamsObj });
    }
  }

  public eliminarProducto(itemCode) {
    this._listaService.eliminarProducto(itemCode, this.idListaUsuario).subscribe(
      response => {
        this._itemService.find(itemCode).subscribe( // Item 1
          response => {
            var index = -1;
            for (var i = 0; i < this.itemsListaBcs.length; i++) {
              if (this.itemsListaBcs[i]['referencia'] === itemCode) {
                index = i;
                this.totalItems = this.totalItems - 1;
              }
            }

            if (index > -1) {
              this.itemsListaBcs.splice(index, 1);
              this.cargarItems(this.availableFields, this.itemsListaBcs, this.queryParams, this.totalItems);
              return;
            }
          }, error => { console.error(error); }
        );
        this._listaService.consultarTotalLista(this.idListaUsuario).subscribe(
          response => {
            this.totalLista = response;
          },
          error => { console.error(error); }
        );
        $('#modalDetalle').modal('hide');
        this.confirmEliminar = false;

        this._listaService.consultarListaPaginada(this.paramsConsulta).subscribe(
          response => {
            this.itemsListaBcs = response;
            if (this.queryParams.has('page')) {
              if (this.queryParams.get('page') != '1' && (this.totalLista - 1) <= parseInt(this.queryParams.get('pageSize'))) {
                this.queryParams.clear();
              }
            }
            this.cargarItems0();
          }, error => { console.error(error); });
      },
      error => {
        this.messageError = "Lo sentimos. Ocurrió un error inesperado, por favor inténtelo más tarde.";
        console.error(error);
      }
    );
  }

  public abrirModalDetalle(itemcode: string, cantidadElegida: number) {
    this.inicializarForm();
    this.messageError = '';
    this.successMessage = '';
    this.valid = true;
    this._itemService.find(itemcode).subscribe( // Item 1
      response => {
        this.formAgregar.itemcode = response.result[0].itemcode;
        this.formAgregar.name = response.result[0].itemname;
        this.formAgregar.image = 'https://img.matisses.co/' + response.result[0].itemcode + '/parrilla/' + response.result[0].itemcode + '_01.jpg';
        this.formAgregar.description = response.result[0].description;
        this.formAgregar.cantidad = cantidadElegida;
        this.formAgregar.precio = response.result[0].priceaftervat;
        this.formAgregar.cantidadmaxima = response.result[0].availablestock;
      }
    );
    $('#modalDetalle').modal('show');
  }

  public guardarCambios() {
    console.log('metodo de guardarCambios');


    $('#modalDetalle').modal('hide');
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

  public buscarLista(codigo: string) {
    this.messageError = '';
    //Asignar datos para enviarlos a WS
    let consultaDTO = {
      nombre: null,
      apellido: null,
      codigo: codigo
    }
    this._listaService.consultarLista(consultaDTO).subscribe(
      response => {
        let respuesta = JSON.parse(JSON.stringify(response));
        if (respuesta.length > 0) {
          this.nombreUsuario = respuesta[0].nombreCreador;
          this.fechaEvento = respuesta[0].formatoFechaEvento;
          this.aceptaBono=response[0].aceptaBonos;
          this.minimoBono=response[0].valorMinimoBono;
          sessionStorage.setItem('formatoFechaEvento', respuesta[0].formatoFechaEvento);
        }
      },
      error => { console.error(error); }
    );
  }

  public aumentarCantidad() {
    if (this.formAgregar.cantidad < this.formAgregar.cantidadmaxima) {
      this.formAgregar.cantidad += 1;
    }
  }

  public reducirCantidad() {
    if (this.formAgregar.cantidad > 1) {
      this.formAgregar.cantidad -= 1;
    }
  }

  private inicializarForm() {
    this.formAgregar = {
      itemcode: '',
      name: '',
      description: '',
      cantidad: 0,
      msjagradecimiento: '',
      image: '',
      precio: 0,
      cantidadmaxima: 0
    };
  }
}
