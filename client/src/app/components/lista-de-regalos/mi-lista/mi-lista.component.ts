import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

import {SessionUsuarioService } from '../../../services/session-usuario.service';
import {ListaRegalosService } from '../../../services/lista-regalos.service';




declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'mi-lista.html',
  styleUrls: ['mi-lista.component.css'],
  providers: [ItemService, SessionUsuarioService,ListaRegalosService]
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
  private availableFields: string[] = ['page', 'pageSize', 'orderBy', 'department', 'group', 'subgroup', 'color', 'minPrice', 'maxPrice', 'brand', 'material', 'collection', 'keywords', 'discount'];
  private idListaUsuario: string;
  private codigoLista: string;
  private fechaEvento:string;
  private paramsConsulta: any;
  private itemsListaBcs:Array<any>;
  private totalLista:number;



  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _userService: SessionUsuarioService, private _listaService: ListaRegalosService) {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista= localStorage.getItem('codigo-lista');
    this.fechaEvento=localStorage.getItem('fecha-evento');
    this.idListaUsuario=localStorage.getItem('id-lista');
    this.queryParams = new Map<string, string>();
    this.itemsXPag = '12 x pag';
    this.orderByStr = 'Similares';
    this.pages = new Array<number>();
    this.items = new Array<Item>();
    this.itemsListaBcs=new Array<any>();
    //this.inicializarParamsConsulta();
    //this.inicializarListaBcs();
  }

  private inicializarParamsConsulta() {
    this.paramsConsulta = {
    idLista:localStorage.getItem('id-lista'),
    pagina:'1',
    registrosPagina:'12',
    orderBy:'referencia asc',
    sortOrder:''
    };
  }

  // private inicializarListaBcs() {
  //   this.itemsListaBcs = {
  //     idLista: '',
  //       idProductoLista:'',
  //       cantidadSeleccionadaFactura: null,
  //       cantidadElegida: null,
  //       cantidadComprada: null,
  //       cantidadEntregada: null,
  //       referencia: '',
  //       descripcionProducto:'',
  //       mensajeAgradecimiento:'',
  //       favorito: false,
  //       active: null
  //   };
  // }


//consultarListaPaginada
  ngOnInit() {
    console.log('entra por aca');
    // if (localStorage.getItem('cambio-clave') == 'si') {
    //   $('#cambioContraseña').modal('show');
    // }
    //this.inicializarParamsConsulta();
  this.nombreUsuario = localStorage.getItem('username-lista');
  this.codigoLista= localStorage.getItem('codigo-lista');
  this.fechaEvento=localStorage.getItem('fecha-evento');
  this.idListaUsuario=localStorage.getItem('id-lista');
console.log('id de la lista'+this.idListaUsuario);
    this.cargarItems0();


  }


  AfterViewInit() {
    console.log('noooo, entra por aca');
      //this.inicializarItems();
      //this.inicializarParamsConsulta();
      this.nombreUsuario = localStorage.getItem('username-lista');
      this.codigoLista= localStorage.getItem('codigo-lista');
      this.fechaEvento=localStorage.getItem('fecha-evento');
      this.idListaUsuario=localStorage.getItem('id-lista');


      this.cargarItems0();


    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 30) {
        console.log(scroll);
        $(".contenedor").addClass("margin-top-scroll");
      } else {
        $(".contenedor").removeClass("margin-top-scroll")
      }
    });

    this.nombreUsuario = localStorage.getItem('username-lista');
    setTimeout(function() {
      if(localStorage.getItem('cambio-clave')=='si'){
        $('#cambioContrasena').modal('show');
      }
    }, 500);
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
    if (this.claveNueva !=this.claveConfirmacion ) {
      this.messageError = 'Ambas contraseñas deben ser iguales.';
      this.successMessage = '';
        return;
    }
    let usuarioDTO = {
      nombreUsuario: this.nombreUsuario,
      password: this.claveNueva,
      usuarioId:localStorage.getItem('usuario-id')

    }

    this._userService.updateUser(usuarioDTO).subscribe(
      response => {

        this.successMessage = '1';
        localStorage.removeItem('cambio-clave');
        localStorage.setItem('cambio-clave','no');
          $('#cambioContrasena').modal('hide');
        return;
      },
      error => {


        this.messageError="ocurrio un error en el servicio";
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
    console.log('cargar items');
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
    console.log('entro en cargarItems0');
    this.items = new Array<Item>();
    this.inicializarParamsConsulta();

    this._route.queryParams.forEach((params: Params) => {
      this.inicializarMapa(params);

      if (this.queryParams.has('pageSize')) {

        this.paramsConsulta.registrosPagina=this.queryParams.get('pageSize');
      }

      if (this.queryParams.has('orderBy')) {
        switch (this.queryParams.get('orderBy')) {
          case 'price':

            this.paramsConsulta.orderBy='precio';
            break;
          case '-price':

            this.paramsConsulta.orderBy='precio asc';
            break;
          case 'itemname':

            this.paramsConsulta.orderBy='referencia';
            break;
          case '-itemname':

            this.paramsConsulta.orderBy='referencia asc';
            break;
          default:

            this.paramsConsulta.orderBy='';
        }
      }
      if(this.queryParams.has('page')){
        this.paramsConsulta.pagina=this.queryParams.get('page');
      }
      console.log('paramsConsulta---'+this.paramsConsulta.registrosPagina);

      this._listaService.consultarTotalLista(this.idListaUsuario).subscribe(
          response => {
            this.totalLista=response;
            console.log('totalLista--'+this.totalLista)
          },
          error =>{
            console.log("error servicio bcs"+error);
          }


      );

      console.log('antes de ir al servicio llevo');
      console.log(this.paramsConsulta.registrosPagina);
      console.log(this.paramsConsulta.idLista);
      console.log(this.paramsConsulta.pagina);
      console.log(this.paramsConsulta.orderBy);
      this._listaService.consultarListaPaginada(this.paramsConsulta).subscribe(
          response => {
            console.log("servicio bcs"+response.data);
            this.itemsListaBcs=response;
            console.log('variable'+this.itemsListaBcs.length);
            this.items=new Array<Item>();
            for (let i = 0; i < this.itemsListaBcs.length; i++) {
               this.itemsListaBcs[i].referencia;
               console.log(this.itemsListaBcs[i].referencia);
               let cadena1=this.itemsListaBcs[i].referencia.substring(0,3);
               let cadena2=this.itemsListaBcs[i].referencia.substring(16,20);
               console.log('cadena1'+cadena1+cadena2);
               this._itemService.find(cadena1+cadena2).subscribe( // Item 1
                 response => {
                   this.items.push(response.result[0]);
                },
                error=>{

                }

              );
            }
            this.cargarItems(this.availableFields, this.items, this.queryParams, this.totalLista);
          },
          error =>{
            console.log("error servicio bcs"+error);
          }


      );

      // this._itemService.filter(this.queryString).subscribe(
      //   response => {
      //     //this.items = response.result;
      //     //this.totalItems=response.records;
      //     for (let i = 0; i < this.items.length; i++) {
      //       //validar si el ítem tiene descuentos
      //       // this._descuentosService.findDiscount(this.items[i].itemcode).subscribe(
      //       //   response => {
      //       //     if (this.items[i].priceaftervat === response.precio) {
      //       //       if (response.descuentos && response.descuentos.length > 0) {
      //       //         this.items[i].descuento = response.descuentos[0].porcentaje;
      //       //         this.items[i].priceafterdiscount = this.items[i].priceaftervat - ((this.items[i].priceaftervat / 100) * this.items[i].descuento);
      //       //       }
      //       //     }
      //       //   },
      //       //   error => {
      //       //     console.error(error);
      //       //   }
      //       // );
      //     }
      //     //this.cargarItems(this.availableFields, this.items, this.queryParams, this.totalLista);
      //     //this.filtrosComponent.inicializarFiltros(this.availableFields, this.queryParams, this.queryString, response.records);
      //   },
      //   error => {
      //     console.error(error);
      //   }
      // );
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



    // this.messageError = '';
    // if (this.claveNueva == null || this.claveNueva.length <= 0) {
    //
    //   this.messageError = 'Ingresa la contraseña';
    //     this.valid = false;
    //     this.successMessage = '';
    //     return;
    // }
    //
    // if (this.claveConfirmacion == null || this.claveConfirmacion.length <= 0 || this.claveConfirmacion == 'undefined') {
    //   this.messageError = 'Ingresa la confirmación de la contraseña.';
    //       this.valid = false;
    //       this.successMessage = '';
    //     return;
    // }
    // if (this.claveNueva !=this.claveConfirmacion ) {
    //   this.messageError = 'Ambas contraseñas deben ser iguales.';
    //   this.successMessage = '';
    //     return;
    // }
    // let usuarioDTO = {
    //   nombreUsuario: this.nombreUsuario,
    //   password: this.claveNueva,
    //   usuarioId:localStorage.getItem('usuario-id')
    //
    // }
    //
     this._listaService.eliminarProducto(itemCode, this.idListaUsuario).subscribe(
       response => {

       this._itemService.find(itemCode).subscribe( // Item 1
         response => {

           var index=-1;
           for (var i = 0; i < this.items.length; i++) {

               if (this.items[i]['shortitemcode'] === itemCode) {
                   index=i;
                   this.totalItems=this.totalItems-1;
               }
           }

           if (index > -1) {
            this.items.splice(index, 1);
            this.cargarItems(this.availableFields, this.items, this.queryParams, this.totalItems);
            return;
          }
        }, error => { console.error(); }
      );
         return;
       },
       error => {


         this.messageError="ocurrio un error en el servicio de eliminacion";
       }
     );
   }

  }
