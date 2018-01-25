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
  }

  ngOnInit() {
    // if (localStorage.getItem('cambio-clave') == 'si') {
    //   $('#cambioContraseña').modal('show');
    // }

  this.nombreUsuario = localStorage.getItem('username-lista');
  this.codigoLista= localStorage.getItem('codigo-lista');
  this.fechaEvento=localStorage.getItem('fecha-evento');
  this.idListaUsuario=localStorage.getItem('id-lista');

    this.cargarItems0();
  }


  ngAfterViewInit() {
      //this.inicializarItems();

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

  private inicializarItems() {

    this.items = new Array<Item>();

    this._itemService.find('2280058').subscribe( // Item 1
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('2240080').subscribe( // Item 1
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('2090109').subscribe( // Item 1
              response => {
                this.items.push(response.result[0]);
                this._itemService.find('2230002').subscribe( // Item 1
                  response => {
                    this.items.push(response.result[0]);
                    this._itemService.find('2090108').subscribe( // Item 1
                      response => {
                        this.items.push(response.result[0]);
                        this._itemService.find('2410024').subscribe( // Item 1
                          response => {
                            this.items.push(response.result[0]);
                            this._itemService.find('2310428').subscribe( // Item 1
                              response => {
                                this.items.push(response.result[0]);
                                this._itemService.find('2310429').subscribe( // Item 1
                                  response => {
                                    this.items.push(response.result[0]);

                                  }, error => { console.error(); }
                                );
                              }, error => { console.error(); }
                            );
                          }, error => { console.error(); }
                        );
                      }, error => { console.error(); }
                    );
                  }, error => { console.error(); }
                );
              }, error => { console.error(); }
            );
          }, error => { console.error(); }
        );
      }, error => { console.error(); }
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
    this._route.queryParams.forEach((params: Params) => {
      this.inicializarMapa(params);
      this._itemService.filter(this.queryString).subscribe(
        response => {
          this.items = response.result;
          this.totalItems=response.records;
          for (let i = 0; i < this.items.length; i++) {
            //validar si el ítem tiene descuentos
            // this._descuentosService.findDiscount(this.items[i].itemcode).subscribe(
            //   response => {
            //     if (this.items[i].priceaftervat === response.precio) {
            //       if (response.descuentos && response.descuentos.length > 0) {
            //         this.items[i].descuento = response.descuentos[0].porcentaje;
            //         this.items[i].priceafterdiscount = this.items[i].priceaftervat - ((this.items[i].priceaftervat / 100) * this.items[i].descuento);
            //       }
            //     }
            //   },
            //   error => {
            //     console.error(error);
            //   }
            // );
          }
          this.cargarItems(this.availableFields, this.items, this.queryParams, response.records);
          //this.filtrosComponent.inicializarFiltros(this.availableFields, this.queryParams, this.queryString, response.records);
        },
        error => {
          console.error(error);
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
