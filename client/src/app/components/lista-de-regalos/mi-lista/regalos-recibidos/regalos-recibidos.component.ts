import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../../../services/global';
import { ItemService } from '../../../../services/item.service';
import { Item } from '../../../../models/item';

import { SessionUsuarioService } from '../../../../services/session-usuario.service';
import { ListaRegalosService } from '../../../../services/lista-regalos.service';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'regalos-recibidos.html',
  styleUrls: ['regalos-recibidos.component.css'],
  providers: [ItemService, SessionUsuarioService, ListaRegalosService]
})

export class RegalosRecibidosComponent implements OnInit, AfterViewInit {
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
  public paramsConsulta: any;
  public itemsListaBcs: Array<any>;
  public totalLista: number;
  public verDetalle: any;
  public idListaUsuario1: number;
  public confirmDevolver: boolean = false;
  public formAgregar: any;
  public mesInicio: string;
  public anoInicio: number;
  public diaInicio: string;
  public dayEvent: Array<number>;
  public yearEvent: Array<number>;
  public monthEvent: Array<number>;
  public validForm2: boolean = true;
  public itemsListaCompra: Array<any>;
  public totalAcumulado: number;
  public urlAvatar: string;
  public urlQr: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _userService: SessionUsuarioService, private _listaService: ListaRegalosService) {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.idListaUsuario = localStorage.getItem('id-lista');
    this.queryParams = new Map<string, string>();
    this.itemsXPag = '12 x pag';
    this.orderByStr = 'Similares';
    this.pages = new Array<number>();
    this.items = new Array<Item>();
    this.itemsListaBcs = new Array<any>();
    this.dayEvent = new Array<number>();
    this.monthEvent = new Array<number>();
    this.yearEvent = new Array<number>();
    this.itemsListaCompra = new Array<any>();
    this.inicializarForm();
    this.inicializarParamsConsulta();
    this.urlAvatar = GLOBAL.urlShared + 'imagenPerfil/';
    this.urlQr = GLOBAL.urlShared + 'qr/';    
  }

  private inicializarParamsConsulta() {
    this.paramsConsulta = {
      idLista: localStorage.getItem('id-lista'),
      pagina: '1',
      registrosPagina: '12',
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
    this.cargarAnos();
    this.cargarItems0();
    $(".perfil-imagen").css("background-image", "url(" + this.urlAvatar + "sin-imagen.jpg)");
    this.existeUrl(this.urlAvatar + 'sin-imagen.jpg');    
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

  public existeUrl(url) {
    url = this.urlAvatar + this.codigoLista + '.jpg';
    var http = new XMLHttpRequest();
    http.open('GET', url, true);
    http.send();
    if (http.status != 404) {
      if (url == this.urlAvatar + this.codigoLista + '.jpg') {
        $(".perfil-imagen").css("background-image", "url(" + this.urlAvatar + this.codigoLista + ".jpg)");
      }
    }
    else {
      url = this.urlAvatar + this.codigoLista + '.png';
      var http = new XMLHttpRequest();
      http.open('GET', url, true);
      http.send();
      if (http.status != 404) {
        $(".perfil-imagen").css("background-image", "url(" + this.urlAvatar + this.codigoLista + ".png)");
      }
      else {
        $(".perfil-imagen").css("background-image", "url(" + this.urlAvatar + "sin-imagen.jpg)");
      }
    }
  }

  public confirmDevolverItem() {
    if (this.confirmDevolver) {
      this.confirmDevolver = false;
    } else {
      this.confirmDevolver = true;
    }
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
    this._router.navigate(['/mi-lista/regalos-recibidos'], { queryParams: queryParamsObj });
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
    let pageSize = parseInt(this.queryParams.has('pageSize') ? this.queryParams.get('pageSize') : '12');
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

      this._listaService.consultarListaComprados(this.paramsConsulta).subscribe(
        response => {
          this.itemsListaBcs = response;
          this.totalLista = this.itemsListaBcs.length;
          this.totalAcumulado = 0;
          for (var i = 0; i < this.itemsListaBcs.length; i++) {
            this.totalAcumulado = this.totalAcumulado + this.itemsListaBcs[i]['precioTotal'];
          }
          this.cargarItems(this.availableFields, this.itemsListaBcs, this.queryParams, this.totalLista);
        },
        error => { console.error(error); });
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
      this._router.navigate(['/mi-lista/regalos-recibidos'], { queryParams: queryParamsObj });
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
          }, error => { console.error(); }
        );
        this._listaService.consultarTotalLista(this.idListaUsuario).subscribe(
          response => {
            this.totalLista = response;
          },
          error => { console.error(error); });
        $('#modalDetalle').modal('hide');
        this.confirmDevolver = false;

        this._listaService.consultarListaComprados(this.paramsConsulta).subscribe(
          response => {
            this.itemsListaBcs = response;

            if (this.queryParams.has('page')) {
              if (this.queryParams.get('page') != '1' && (this.totalLista - 1) <= parseInt(this.queryParams.get('pageSize'))) {
                this.queryParams.clear();
              }
            }
            this.cargarItems0();
          },
          error => {
            console.error(error);
          }
          //arreglos en el eliminar
        );
        //  return;
      },
      error => {
        this.messageError = "Ocurrio un error en el servicio de eliminacion";
      }
    );
  }

  public abrirModalDetalle(itemcode: string, cantidadElegida: number,cantidadComprada:number) {
    this.inicializarForm();
    this.messageError = '';
    this.successMessage = '';
    this.valid = true;
    this.itemsListaCompra = new Array<any>();
    this._itemService.find(itemcode).subscribe( // Item 1
      response => {
        this.formAgregar.shortcode = response.result[0].shortitemcode;
        this.formAgregar.itemcode = response.result[0].itemcode;
        this.formAgregar.name = response.result[0].itemname;
        this.formAgregar.image = 'https://img.matisses.co/' + response.result[0].itemcode + '/parrilla/' + response.result[0].itemcode + '_01.jpg';
        this.formAgregar.description = response.result[0].description;
        this.formAgregar.cantidad =cantidadComprada;
        this.formAgregar.precio = response.result[0].priceaftervat;
        this.formAgregar.cantidadmaxima = cantidadElegida;

        let datosCompra = {
          idLista: this.idListaUsuario,
          referencia: response.result[0].itemcode
        }

        this._listaService.consultarDetalleCompra(datosCompra).subscribe(
          response => {
            this.itemsListaCompra = response;
            for (var i = 0; i < this.itemsListaCompra.length; i++) {
              this.itemsListaCompra[i]['formAgregar'] = this.formAgregar;

            }
          }, error => { console.error(error); });
      });
    $('#modalDetalle').modal('show');
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
          sessionStorage.setItem('formatoFechaEvento', respuesta[0].formatoFechaEvento);
        }
      },
      error => { console.error(error); });
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
      cantidadmaxima: 0,
      devuelto:0
    };
  }

  public cargarDias(mes: string, ano: number) {
    this.dayEvent = new Array<number>();
    switch (mes) {
      case '01':  // Enero
      case '03':  // Marzo
      case '05':  // Mayo
      case '07':  // Julio
      case '08':  // Agosto
      case '10':  // Octubre
      case '12': // Diciembre
        for (let i = 1; i <= 31; i++) {
          this.dayEvent.push(i);
        }
        break;
      case '04':  // Abril
      case '06':  // Junio
      case '09':  // Septiembre
      case '11': // Noviembre
        for (let i = 1; i <= 30; i++) {
          this.dayEvent.push(i);
        }
        break;
      case '02':  // Febrero
        if (((ano % 100 == 0) && (ano % 400 == 0) || (ano % 100 != 0) && (ano % 4 == 0))) {
          for (let i = 1; i <= 29; i++) {
            this.dayEvent.push(i);
          }
        } else {
          for (let i = 1; i <= 28; i++) {
            this.dayEvent.push(i);
          }
        }
        break;
    }
  }

  public cargarAnos() {
    var date = new Date();
    var year = date.getFullYear();
    this.yearEvent = new Array<number>();
    for (let i = year; i <= year + 1; i++) {
      this.yearEvent.push(i);
    }
  }

  public programar() {
    let listaDatos = {
      formatoFechaEntrega: this.anoInicio.toString() + '-' + this.mesInicio + '-' + this.diaInicio,
      idLista: this.idListaUsuario
    }

    this._listaService.updateFechaEntrega(listaDatos).subscribe(
      response => {
        this.successMessage = 'se actualizo correctamente la fecha de entrega';
        return;
      },
      error => {
        console.error(error);
        this.messageError = 'error en la actualización de la fecha de entrega';
        return;
      }
    );
  }

  public devolverProducto(itemCode, factura, cantidad) {

    let salesDocumentLineDTO={
      itemCode:itemCode,
      quantity:cantidad
    }
    console.log('itemCode '+itemCode);
    console.log('factura '+factura);
    console.log('cantidad '+cantidad);
    this._listaService.devolverItemsFactura(this.idListaUsuario, factura,salesDocumentLineDTO).subscribe(
      response => {

        if(response>0){

          this.successMessage = 'se realizo la devolucion correctamente';
          return;
        }
        else{
          this.messageError = "Lo sentimos. Ocurrió un error inesperado, por favor inténtelo más tarde.";
            return;
        }

      },
      error => {
        this.messageError = "Lo sentimos. Ocurrió un error inesperado, por favor inténtelo más tarde.";
        console.error(error);
      }
    );
  }
}
