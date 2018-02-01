import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';

import {SessionUsuarioService } from '../../../services/session-usuario.service';
import {ListaRegalosService } from '../../../services/lista-regalos.service';

import { CarritoRegalosComponent } from '././carrito-regalos/carrito-regalos.component';
import { CarritoRegalosSimpleComponent } from '././carrito-regalos/carrito-regalos-simple.component';




declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'lista-invitado.html',
  styleUrls: ['lista-invitado.component.css'],
  providers: [ItemService, SessionUsuarioService,ListaRegalosService]
})

export class ListaInvitadoComponent implements OnInit, AfterViewInit {
  // @ViewChild(CarritoRegalosComponent)
  // public carrito: CarritoRegalosComponent;
  @ViewChild(CarritoRegalosSimpleComponent) carrito: CarritoRegalosSimpleComponent;
  public lastAddedItem: Item;
  public itemsSinSaldo: Array<Item>;
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
  public url:string;
  private viewportWidth: number = 0;
  public itemsXPag: string;
  public orderByStr: string;
  public pages: Array<number>;
  public keywords: string = '';
  private availableFields: string[] = ['page', 'pageSize', 'orderBy', 'department', 'group', 'subgroup', 'color', 'minPrice', 'maxPrice', 'brand', 'material', 'collection', 'keywords', 'discount'];
  private idListaUsuario: string;
  private codigoLista: string;
  private fechaEvento:string;
  public resumenMobileVisible: boolean = false;
  public resumenDesktopVisible: boolean = false;

  private paramsConsulta: any;
  private itemsListaBcs:Array<any>;
  private totalLista:number;

  //campos carrito carrito simple
  public shoppingCart: any;
  public item: Item;
  private idCarrito: string;
 public totalItemsCarrito: number;
  public totalCarrito: number = 0;
  public totalImpuestos: number = 0;
  public totalDescuentos: number = 0;
  public mostrar: boolean = true;


  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _userService: SessionUsuarioService, private _listaService: ListaRegalosService) {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista= localStorage.getItem('codigo-lista');
    this.fechaEvento=localStorage.getItem('fecha-evento');
    //this.idListaUsuario=localStorage.getItem('id-lista');cambiar a esta al tener la consulta
    this.idListaUsuario=sessionStorage.getItem('id-lista');
    this.queryParams = new Map<string, string>();
    this.itemsXPag = '12 x pag';
    this.orderByStr = 'Similares';
    this.pages = new Array<number>();
    this.items = new Array<Item>();
    this.url = this._router.url;
    this.itemsListaBcs=new Array<any>();


    //carrito de COMPRAS
    this.inicializarShoppingCart();
  }

  private inicializarParamsConsulta() {
    this.paramsConsulta = {
    idLista:sessionStorage.getItem('id-lista'),
    pagina:'1',
    registrosPagina:'12',
    orderBy:'referencia asc',
    sortOrder:''
    };
  }

  ngOnInit() {
    // if (localStorage.getItem('cambio-clave') == 'si') {
    //   $('#cambioContraseña').modal('show');
    // }

  this.nombreUsuario = localStorage.getItem('username-lista');
  this.codigoLista= localStorage.getItem('codigo-lista');
  this.fechaEvento=localStorage.getItem('fecha-evento');
  this.idListaUsuario=sessionStorage.getItem('id-lista');
  this.cargarCarrito();
  this.cargarItems0();
  }


  ngAfterViewInit() {
      //this.inicializarItems();
      //this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      this.nombreUsuario = localStorage.getItem('username-lista');
      this.codigoLista= localStorage.getItem('codigo-lista');
      this.fechaEvento=localStorage.getItem('fecha-evento');
      this.idListaUsuario=sessionStorage.getItem('id-lista');

      //this.cargarItems0();


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
      if(localStorage.getItem('cambio-clave')=='si'){
        $('#cambioContrasena').modal('show');
      }
    }, 500);
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
    this._router.navigate(['/lista/codigo'], { queryParams: queryParamsObj });
  }

  public cargarItems(availableFields, items, queryParams, records) {

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


      this._listaService.consultarTotalLista(this.idListaUsuario).subscribe(
          response => {
            this.totalLista=response;

          },
          error =>{
            console.log("error servicio bcs"+error);
          }


      );


      this._listaService.consultarListaPaginada(this.paramsConsulta).subscribe(
          response => {

            this.itemsListaBcs=response;

            this.items=new Array<Item>();
            for (let i = 0; i < this.itemsListaBcs.length; i++) {
               this.itemsListaBcs[i].referencia;

               let cadena1=this.itemsListaBcs[i].referencia.substring(0,3);
               let cadena2=this.itemsListaBcs[i].referencia.substring(16,20);

               this._itemService.find(cadena1+cadena2).subscribe( // Item 1
                 response => {
                   response.result[0].cantidadElegida=this.itemsListaBcs[i].cantidadElegida;
                   response.result[0].cantidadComprada=this.itemsListaBcs[i].cantidadComprada;

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
      this._router.navigate(['/lista/codigo'], { queryParams: queryParamsObj });
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

   //carrito de compras ListaRegalos
   public agregarCarrito(item: Item) {

     item.selectedQuantity = item.selectedQuantity;
     this.procesarItem(item);

   }

   public procesarItem(item: Item) {

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
         error => {
           console.log(error);
         }
       );
     } else {
       this.cambiarItem(item);
     }
   }

   private cambiarItem(item: Item) {
     //0. Cargar contenido de localStorage
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
     //consultar localstorage

     let localSC = JSON.parse(localStorage.getItem('matisses.shoppingCart.List'));
     if (!localSC) {
       this.inicializarShoppingCart();
     } else {
       this.shoppingCart = localSC;
     }
     //TODO: validar si el carrito esta vigente
     //TODO: validar el saldo y los precios de los items en el carrito si la fecha de creacion es del dia anterior

     if (this.shoppingCart.items === null) {
       this.shoppingCart.items = new Array<Item>();
     }
     this.procesarCarrito();
   }

   public procesarCarrito() {
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

   public inicializarShoppingCart(){

     this.shoppingCart = {
       _id: null,
       metodoEnvio: null,
       fechacreacion: new Date(),
       items: new Array<Item>()
     };
   }

   public eliminarItem(item: Item) {
     item.selectedQuantity = 0;
     this.procesarItem(item);
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

   public openResumen() {
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
     this.cargarCarrito();
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

     if(item.cantidadElegida > item.selectedQuantity){
       if(item.selectedQuantity<=(item.cantidadElegida-item.cantidadComprada)){
          item.selectedQuantity += 1;
       }

     }


     this.procesarItem(item);


   }

   public reducirCantidad(item:Item) {
     if (item.selectedQuantity > 1) {
       item.selectedQuantity -= 1;
     }
   }


  }
