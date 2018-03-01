import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

import { SessionUsuarioService } from '../../../services/session-usuario.service';
import { ListaRegalosService } from '../../../services/lista-regalos.service';

import { CarritoRegalosComponent } from '././carrito-regalos/carrito-regalos.component';
import { CarritoRegalosSimpleComponent } from '././carrito-regalos/carrito-regalos-simple.component';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'lista-invitado.html',
  styleUrls: ['lista-invitado.component.css'],
  providers: [ItemService, SessionUsuarioService, ListaRegalosService]
})

export class ListaInvitadoComponent implements OnInit, AfterViewInit {
  @ViewChild(CarritoRegalosSimpleComponent)
  public carrito: CarritoRegalosSimpleComponent;
  public lastAddedItem: Item;
  public itemsSinSaldo: Array<Item>;
  public nombreUsuario: string;
  public claveNueva: string;
  public claveConfirmacion: string;
  public messageError: string;
  public formatoFechaEvento: string;
  public novios: string;
  public items: Array<Item>;
  public queryParams: Map<string, string>;
  public queryString: string;
  public valid: boolean;
  public successMessage: string;
  public totalItems: number;
  public activePage: number;
  public url: string;
  public viewportWidth: number = 0;
  public itemsXPag: string;
  public orderByStr: string;
  public pages: Array<number>;
  public keywords: string = '';
  public availableFields: string[] = ['page', 'pageSize', 'orderBy', 'department', 'group', 'subgroup', 'color', 'minPrice', 'maxPrice', 'brand', 'material', 'collection', 'keywords', 'discount'];
  public idListaUsuario: string;
  public codigoLista: string;
  public fechaEvento: string;
  public resumenMobileVisible: boolean = false;
  public resumenDesktopVisible: boolean = false;
  public paramsConsulta: any;
  public itemsListaBcs: Array<any>;
  public totalLista: number;
  public showBadge: boolean = true;
  //campos carrito carrito simple
  public shoppingCart: any;
  private resultados: any;
  public item: Item;
  public idCarrito: string;
  public totalItemsCarrito: number;
  public totalCarrito: number = 0;
  public totalImpuestos: number = 0;
  public totalDescuentos: number = 0;
  public mostrar: boolean = true;
  public montoBono: number;
  public aceptaBono: boolean = false;
  public minimoBono: number = 0;
  public formAgregar: any;
  public conteoDias: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _userService: SessionUsuarioService, private _listaService: ListaRegalosService) {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.novios = sessionStorage.getItem('novios');
    this.conteoDias = sessionStorage.getItem('conteo-Dias');
    this.resultados = sessionStorage.getItem('resultados');
    //this.idListaUsuario = localStorage.getItem('id-lista');
    this.queryParams = new Map<string, string>();
    this.itemsXPag = '12 x pag';
    this.orderByStr = 'Similares';
    this.pages = new Array<number>();
    this.items = new Array<Item>();
    this.url = this._router.url;
    this.itemsListaBcs = new Array<any>();
    //carrito de COMPRAS
    this.inicializarShoppingCart();
    this.inicializarForm();
  }

  private inicializarParamsConsulta() {
    let paginaRegistro = '12';
    if (this.aceptaBono) {
      paginaRegistro = '11';
    }
    this.paramsConsulta = {
      idLista: localStorage.getItem('id-lista'),
      pagina: '1',
      registrosPagina: paginaRegistro,
      orderBy: 'referencia asc',
      sortOrder: '',
      keywords:''
    };
  }

  ngOnInit() {
    this.novios = sessionStorage.getItem('novios');
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.idListaUsuario = localStorage.getItem('id-lista');

    if (this.codigoLista == null) {
      this._route.queryParams.subscribe(params => {
        this.codigoLista = params['codigoLista'];
      });

      let consultaDTO = {
        nombre: null,
        apellido: null,
        codigo: this.codigoLista
      }
      this._listaService.consultarLista(consultaDTO).subscribe(
        response => {
          if (response.length > 0) {
            this.idListaUsuario = response[0].idLista;
            this.fechaEvento = response[0].formatoFechaEvento;
            this.aceptaBono = response[0].aceptaBonos;
            this.minimoBono = response[0].valorMinimoBono;
            this.conteoDias = response[0].contadorDias;
            localStorage.setItem('id-lista', this.idListaUsuario);
            localStorage.setItem('codigo-lista', this.codigoLista);
            this.inicializarShoppingCart();
            this.cargarItems0();
            //this.cargarFechaEvento();
            this.showBadge = true;
          }
        },
        error => {
          console.error(error);
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, intentelo mas tarde.';
        }
      );
    }
    else {
      let consultaDTO = {
        nombre: null,
        apellido: null,
        codigo: this.codigoLista
      }
      this._listaService.consultarLista(consultaDTO).subscribe(
        response => {
          if (response.length > 0) {
            this.idListaUsuario = response[0].idLista;
            this.fechaEvento = response[0].formatoFechaEvento;
            this.aceptaBono = response[0].aceptaBonos;
            this.minimoBono = response[0].valorMinimoBono;
            this.conteoDias = response[0].contadorDias;
            localStorage.setItem('id-lista', this.idListaUsuario);
            localStorage.setItem('codigo-lista', this.codigoLista);
            this.inicializarShoppingCart();
            this.cargarItems0();
            //this.cargarFechaEvento();
            this.showBadge = true;
          }
        },
        error => {
          console.error(error);
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, intentelo mas tarde.';
        }
      );
    }
  }

  ngAfterViewInit() {
    if (this.codigoLista == null) {
      this._route.queryParams.subscribe(params => {
        this.codigoLista = params['codigoLista'];
      });

      let consultaDTO = {
        nombre: null,
        apellido: null,
        codigo: this.codigoLista
      }
      this._listaService.consultarLista(consultaDTO).subscribe(
        response => {
          if (response.length > 0) {
            this.idListaUsuario = response[0].idLista;
            this.fechaEvento = response[0].formatoFechaEvento;
            this.aceptaBono = response[0].aceptaBonos;
            this.minimoBono = response[0].valorMinimoBono;
            this.conteoDias = response[0].contadorDias;
          }
        },
        error => {
          console.error(error);
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, intentelo mas tarde.';
        }
      );
    }

    //Imagen de Perfil
    $(".perfil-imagen").css("background-image", "url(https://360.matisses.co:8443/shared/lista-regalos/imagenPerfil/" + this.codigoLista + ".jpg)");

  }

  // public cargarFechaEvento() {
  //   if (this.codigoLista != null && this.codigoLista.length > 0) {
  //     let consultaDTO = {
  //       nombre: '',
  //       apellido: '',
  //       codigo: this.codigoLista
  //     }
  //     this._listaService.consultarLista(consultaDTO).subscribe(
  //       response => {
  //         if (response.length > 0) {
  //           this.formatoFechaEvento = response[0].formatoFechaEvento;
  //           this.idListaUsuario = response[0].idLista;
  //           this.aceptaBono = response[0].aceptaBonos;
  //           this.minimoBono = response[0].valorMinimoBono;
  //         }
  //       },
  //       error => { console.error(error); }
  //     );
  //   }
  // }

  // public irAPagina(pagina) {
  //   if(pagina>0){
  //   if(pagina <= this.pages.length){
  //     console.log('pagina '+pagina+' '+this.pages.length);
  //   this.queryParams.set('page', pagina);
  //   this.navigate();
  //   }
  // }
  // }

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
    this._router.navigate(['/lista/' + this.codigoLista], { queryParams: queryParamsObj });
  }

  public cargarItems(availableFields, items, queryParams, records) {
    if (this.codigoLista == null) {
      this._route.queryParams.subscribe(params => {
        this.codigoLista = params['codigoLista'];
      });

      let consultaDTO = {
        nombre: null,
        apellido: null,
        codigo: this.codigoLista
      }
      this._listaService.consultarLista(consultaDTO).subscribe(
        response => {
          if (response.length > 0) {

            this.idListaUsuario = response[0].idLista;
            this.fechaEvento = response[0].formatoFechaEvento;
            this.aceptaBono = response[0].aceptaBonos;
            this.minimoBono = response[0].valorMinimoBono;
            localStorage.setItem('id-lista', this.idListaUsuario);
            localStorage.setItem('fecha-evento', this.fechaEvento);
          }
        },
        error => {
          console.error(error);
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, intentelo mas tarde.';
        }
      );
    }

    this.items = new Array<Item>();
    this.items = items;
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
      if (this.keywords && this.keywords.length > 0) {
        this.paramsConsulta.keywords=this.keywords;
      }

      this._listaService.consultarListaPaginada(this.paramsConsulta).subscribe(
        response => {
          this.itemsListaBcs = response;
          this.items = new Array<Item>();
          for (let i = 0; i < this.itemsListaBcs.length; i++) {


            this._itemService.find(this.itemsListaBcs[i].referencia).subscribe( // Item 1
              response => {

                response.result[0].selectedQuantity = 0;
                response.result[0].cantidadElegida = this.itemsListaBcs[i].cantidadElegida;
                response.result[0].cantidadComprada = this.itemsListaBcs[i].cantidadComprada;
                if (response.result[0].cantidadElegida > response.result[0].cantidadComprada) {
                  this.items.push(response.result[0]);
                }
              },
              error => { console.error(error); }
            );
          }

          this.cargarItems(this.availableFields, this.items, this.queryParams, this.items.length);
        },
        error => { console.error(error); }
      );

      this._listaService.consultarTotalLista(this.idListaUsuario).subscribe(
        response => {
          this.totalLista = response;

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
    console.log('entro aca '+this.keywords);
    if (this.keywords && this.keywords.length > 0) {
      let queryParamsObj = { keywords: this.keywords.replace(/ /g, ",") };
      //this.navigate();
     this._router.navigate(['/mi-lista'], { queryParams: queryParamsObj });
    }
    else{
      this.keywords='';
      let queryParamsObj = { keywords: this.keywords.replace(/ /g, ",") };
       this._router.navigate(['/mi-lista']);
      //this.navigate();
    }
  }

  public eliminarProducto(itemCode) {
    this._listaService.eliminarProducto(itemCode, this.idListaUsuario).subscribe(
      response => {
        this._itemService.find(itemCode).subscribe( // Item 1
          response => {
            var index = -1;
            for (var i = 0; i < this.items.length; i++) {
              if (this.items[i]['shortitemcode'] === itemCode) {
                index = i;
                this.totalItems = this.totalItems - 1;
              }
            }

            if (index > -1) {
              this.items.splice(index, 1);
              this.cargarItems(this.availableFields, this.items, this.queryParams, this.totalItems);
              return;
            }
          }, error => { console.error(error); }
        );
        return;
      },
      error => {
        this.messageError = "Ocurrio un error en el servicio de eliminación.";
      }
    );
  }

  //carrito de compras ListaRegalos
  public agregarCarrito(item: Item) {
    if (this.shoppingCart.bono.valor == 0) {
      if (item.selectedQuantity > 0) {
        item.messageError = null;
        item.selectedQuantity = item.selectedQuantity;
        this.procesarItem(item);
        this.formAgregar.itemname = item.itemname;
        this.formAgregar.itemcode = item.itemcode;
        this.formAgregar.precio = item.priceaftervat;

        this.formAgregar.cantidadSeleccionada = item.selectedQuantity;

        $('#carritoModalResumen').modal('show');
      }
      else {
        item.messageError = 'Debe seleccionar la cantidad que desea regalar';
      }
    }
    else {
      $('#modalBono').modal('show');
    }
  }

  public agregarBono(valor: number) {
    if (this.totalItemsCarrito > 0) {
      this.messageError = 'No puedes comprar bono de regalos en una misma compra de productos';
    } else {
      if (valor < this.minimoBono) {

        this.messageError = 'El monto mínimo del bono de regalo es $ ' + this.minimoBono;
      }
      else {
        if (valor > 0 && valor >= this.minimoBono) {
          this.shoppingCart.bono.isBono = true;
          this.shoppingCart.bono.valor = valor;
          if (this.totalItemsCarrito > 0) {
            this.totalItemsCarrito = this.totalItemsCarrito + 1;
          }
          else {
            this.totalItemsCarrito = 1;
          }
          if (this.totalCarrito > 0) {
            this.totalCarrito = this.totalCarrito + valor;
          }
          else {
            this.totalCarrito = valor;
          }
          this.openResumen();
          localStorage.setItem('matisses.shoppingCart.bono', JSON.stringify(this.shoppingCart.bono.valor));
        }
        else {
          this.messageError = 'El monto mínimo del bono de regalo es $ ' + this.minimoBono;
        }
      }
    }
  }

  public procesarItem(item: Item) {
    if (this.shoppingCart.bono.isBono == false) {

      item.selectedQuantity = parseInt(item.selectedQuantity.toString());
      if (item.selectedQuantity > 0) {
        let items = new Array<Item>();
        items.push(item);

        this._itemService.validarItems(items).subscribe(
          response => {
            if (response[0].sinSaldo) {
              //modal sin saldo
              item.availablestock = response[0].availablestock;
              localStorage.setItem('matisses.lastAddedItem', JSON.stringify(item));
              $('#modalSinSaldo').modal('show');
            } else {
              this.cambiarItem(item);
            }
          },
          error => { console.error(error); }
        );
      } else {
        this.cambiarItem(item);
      }
    }
    else {

    }
  }

  private cambiarItem(item: Item) {
    //  0. Cargar contenido de localStorage
    this.cargarCarrito();
    //1. validar contenido
    let encontrado = false;
    for (let i = 0; i < this.shoppingCart.items.length; i++) {
      if (this.shoppingCart.items[i].itemcode === item.itemcode) {
        encontrado = true;
        if (item.selectedQuantity === 0) {
          //eliminar item
          this.shoppingCart.items.splice(i, 1);
        } else {
          //modificar el item
          //let sumatoria=parseInt(this.shoppingCart.items[i].selectedQuantity) + parseInt(item.selectedQuantity);
          this.shoppingCart.items[i].selectedQuantity = item.selectedQuantity;
        }
        break;
      }
    }
    //2. agregar
    if (!encontrado) {
      this.shoppingCart.items.push(item);
    }
    //3. guardar
    localStorage.setItem('matisses.shoppingCart.List', JSON.stringify(this.shoppingCart));
    //4. Actualizar contenido HTML
    this.procesarCarrito();

    let components = document.getElementsByClassName("total-items-carrito-badge");
    for (let i = 0; i < components.length; i++) {
      components[i].innerHTML = this.totalItems.toString();
    }

    if (!encontrado && this.mostrar) {
      localStorage.setItem('matisses.lastAddedItem', JSON.stringify(item));
      $('#carritoModal').modal('show');
    }
  }

  public cargarCarrito() {
    let localSC = JSON.parse(localStorage.getItem('matisses.shoppingCart.List'));
    if (!localSC) {
      this.inicializarShoppingCart();
    } else {
      this.shoppingCart = localSC;
    }
    if (this.shoppingCart.bono.isBono) {

    }
    //validar si el carrito esta vigente
    //validar el saldo y los precios de los items en el carrito si la fecha de creacion es del dia anterior
    if (this.shoppingCart.items === null) {
      this.shoppingCart.items = new Array<Item>();
    }
    this.procesarCarrito();
  }

  private procesarCarrito() {

    this.totalItemsCarrito = 0;
    this.totalCarrito = 0;
    this.totalImpuestos = 0;
    this.totalDescuentos = 0;
    let totalSinIVA = 0;
    for (let i = 0; i < this.shoppingCart.items.length; i++) {
      let selectedQuantity = this.shoppingCart.items[i].selectedQuantity ? this.shoppingCart.items[i].selectedQuantity : 0;
      let price = this.shoppingCart.items[i].priceaftervat ? this.shoppingCart.items[i].priceaftervat : 0;
      this.totalItemsCarrito += selectedQuantity;
      this.totalCarrito += (price * selectedQuantity);
      if (this.shoppingCart.items[i].priceafterdiscount && this.shoppingCart.items[i].priceafterdiscount > 0) {
        let valorIVA = this.shoppingCart.items[i].priceafterdiscount * this.shoppingCart.items[i].taxpercent / 100;
        totalSinIVA += ((this.shoppingCart.items[i].priceafterdiscount - valorIVA) * selectedQuantity);
        this.totalDescuentos += ((this.shoppingCart.items[i].priceaftervat / 100) * this.shoppingCart.items[i].descuento) * selectedQuantity;
      } else {
        totalSinIVA += (this.shoppingCart.items[i].pricebeforevat ? this.shoppingCart.items[i].pricebeforevat : 0) * selectedQuantity;
      }
    }
    this.totalImpuestos = (this.totalCarrito - this.totalDescuentos - totalSinIVA) | 0;
  }

  private inicializarShoppingCart() {

    this.shoppingCart = {
      _id: null,
      metodoEnvio: null,
      fechacreacion: new Date(),
      items: new Array<Item>(),
      bono: {
        valor: 0,
        isBono: false
      }
    };
  }

  public eliminarItem(item: Item) {
    item.selectedQuantity = 0;
    this.procesarItem(item);
  }

  public eliminarBono() {
    if (this.totalCarrito > 0) {
      this.totalCarrito = this.totalCarrito - this.shoppingCart.bono.valor;
    }
    if (this.totalItemsCarrito > 0) {
      this.totalItemsCarrito = this.totalItemsCarrito - 1;
    }
    this.shoppingCart.bono.isBono = false;
    this.shoppingCart.bono.valor = 0;
    this.montoBono = 0;
    localStorage.removeItem('matisses.shoppingCart.bono');
  }

  public mostrarBotonEliminar() {
    return this.url && !this.url.includes('pago') && !this.url.includes('carrito');
  }

  public toggleResumen() {
    if (this.resumenMobileVisible || this.resumenDesktopVisible) {
      //ocultar mobile
      this.closeResumen();
    } else {
      //mostrar mobile/desktop
      this.openResumen();
    }
  }

  private openResumen() {
    if (this.viewportWidth <= 991) {
      //mostrar mobile
      const divs = document.getElementById("carrito1").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "315px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0.75)";
          this.resumenMobileVisible = true;
          break;
        }
      }
    } else {
      //mostrar desktop
      const divs = document.getElementById("carrito2").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "315px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0.75)";
          this.resumenDesktopVisible = true;
          break;
        }
      }
    }
    if (this.shoppingCart.bono.valor == 0) {
      this.cargarCarrito();
    }
    else {

    }

  }

  public closeResumen() {
    if (this.viewportWidth <= 991) {
      //mostrar mobile
      const divs = document.getElementById("carrito1").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "0px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0)";
          this.resumenMobileVisible = false;
          break;
        }
      }
    } else {
      //mostrar desktop
      const divs = document.getElementById("carrito2").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "0px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0)";
          this.resumenDesktopVisible = false;
          break;
        }
      }
    }
  }
  public aumentarCantidad(item: Item) {

    if (item.cantidadElegida > item.selectedQuantity) {
      if (item.selectedQuantity < (item.cantidadElegida - item.cantidadComprada)) {
        item.selectedQuantity += 1;
      }
    }

  }

  public reducirCantidad(item: Item) {
    if (item.selectedQuantity > 0) {
      item.selectedQuantity -= 1;
    }
  }

  private inicializarForm() {
    this.formAgregar = {
      itemcode: '',
      itemname: '',
      description: '',
      cantidad: 0,
      msjagradecimiento: '',
      image: '',
      precio: 0,
      cantidadSeleccionada: 0,
      color: '',
      priceafterdiscount: 0
    };
  }
}
