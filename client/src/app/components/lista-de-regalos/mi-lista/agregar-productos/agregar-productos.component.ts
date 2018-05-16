import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../../../services/global';
import { ItemService } from '../../../../services/item.service';
import { Item } from '../../../../models/item';
import { ListaRegalosService } from '../../../../services/lista-regalos.service';

declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'agregar-productos.html',
  styleUrls: ['agregar-productos.component.css'],
  providers: [ItemService, ListaRegalosService]
})

export class AgregarProductosComponent implements OnInit {
  public items: Array<Item>;
  public itemsAgregados: Array<Item>;
  public filtrosDisponibles: Map<String, Array<any>>;
  public filtrosAplicados: Array<string[]>;
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
  public minPrice: number;
  public maxPrice: number;
  public viewHasLoaded: boolean = false;
  public formAgregar: any;
  public idListaUsuario: string;
  public messageError: string;
  public nombreUsuario: string;
  public codigoLista: string;
  public fechaEvento: string;
  public fechaEntrega: string;
  public mostrarFiltro: boolean = true;
  public mostrarCategoria: boolean = true;
  private viewportWidth: number = 0;
  public itemsListaBcs: Array<any>;
  public urlAvatar: string;
  public urlQr: string;
  public totalLista: string;
  public totalComprado: string;
  public totalAcumulado: string
  public novios: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _listaService: ListaRegalosService) {
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.idListaUsuario = localStorage.getItem('id-lista');
    this.filtrosDisponibles = new Map<String, Array<any>>();
    this.filtrosAplicados = new Array<string[]>();
    this.queryParams = new Map<string, string>();
    this.itemsXPag = '12 x pag';
    this.orderByStr = 'Similares';
    this.pages = new Array<number>();
    this.items = new Array<Item>();
    this.itemsListaBcs = new Array<any>();
    this.itemsAgregados = new Array<Item>();
    this.mostrarFiltro = false;
    this.inicializarForm();
    this.urlAvatar = GLOBAL.urlShared + 'imagenPerfil/';
    this.urlQr = GLOBAL.urlShared + 'qr/';
    this.totalLista = localStorage.getItem('total-por-comprar');
    this.totalComprado = localStorage.getItem('total-comprado');
    this.totalAcumulado = localStorage.getItem('total-acumulado');
    this.novios = localStorage.getItem('novios-header');
  }

  private inicializarForm() {
    this.formAgregar = {
      itemcode: '',
      name: '',
      description: '',
      cantidad: 0,
      msjagradecimiento: '',
      image: ''
    };
  }

  ngOnInit() {
    localStorage.removeItem('total-por-comprar');
    localStorage.removeItem('total-comprado');
    this.nombreUsuario = localStorage.getItem('username-lista');
    this.codigoLista = localStorage.getItem('codigo-lista');
    this.fechaEvento = localStorage.getItem('fecha-evento');
    this.fechaEntrega = localStorage.getItem('fecha-entrega');
    this.idListaUsuario = localStorage.getItem('id-lista');
    this.itemsAgregados = new Array<Item>();
    this.cargarItems0();
    this.buscarLista(this.codigoLista);
    $(".perfil-imagen").css("background-image", "url(" + this.urlAvatar + "sin-imagen.jpg)");
    this.existeUrl(this.urlAvatar + 'sin-imagen.jpg');
  }

  ngAfterViewInit() {
    this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    if (this.viewportWidth <= 768) {
      this.mostrarFiltro = true;
      this.mostrarCategoria = false;
    } else {
      this.mostrarFiltro = false;
      this.mostrarCategoria = true;
    }

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

  public showFiltros() {
    if (this.mostrarFiltro) {
      this.mostrarFiltro = false;
    } else {
      this.mostrarFiltro = true;
    }
  }

  private scrollAfterFiter() {
    if (this.viewportWidth <= 768) {
      $("html, body").animate({ scrollTop: 400 }, 1000);
      this.showFiltros();
    } else {
      console.log('no hay que hacer scroll')
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
    this._router.navigate(['/mi-lista/agregar-productos'], { queryParams: queryParamsObj });
  }

  private navigateFilter() {
    let queryParamsObj = {};
    for (let i = 0; i < this.availableFields.length; i++) {
      let key = this.availableFields[i];
      queryParamsObj[key] = this.queryParams.get(key);
    }
    queryParamsObj['page'] = '1';
    this._router.navigate(['/mi-lista/agregar-productos'], { queryParams: queryParamsObj });
  }

  public buscarLista(codigo: string) {
    this.messageError = '';
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
          this.fechaEntrega = response[0].formatoFechaEntrega;
          this.novios = response[0].nombreCreador + ' ' + response[0].apellidoCreador + '<span class="anpersan"> & </span>' + response[0].nombreCocreador + ' ' + response[0].apellidoCocreador;
          sessionStorage.setItem('formatoFechaEvento', respuesta[0].formatoFechaEvento);
          sessionStorage.setItem('formatoFechaEntrega', respuesta[0].formatoFechaEntrega);
        }
      },
      error => { console.error(error); });
  }

  public cargarItems(availableFields, items, queryParams, records) {
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

      let paramsConsulta = {
        idLista: localStorage.getItem('id-lista')
      };
      this._itemService.filter(this.queryString).subscribe(
        response => {
          this.items = response.result;
          this.totalItems = response.records;

          for (let i = 0; i < this.items.length; i++) {
            this._listaService.consultarListaSinPaginar(paramsConsulta).subscribe(
              response => {
                this.itemsListaBcs = response;

                for (var j = 0; j < this.itemsListaBcs.length; j++) {
                  if (this.itemsListaBcs[j]['referencia'] === this.items[i].shortitemcode) {
                    this.items[i].agregadoLista = true;
                  }
                }
              },
              error => {
                console.error(error);
              }
            );
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
          this.inicializarFiltros(this.availableFields, this.queryParams, this.queryString, response.records);
        },
        error => { console.error(error); }
      );
    });
  }

  //consultarListaSinPaginar
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
      this._router.navigate(['/mi-lista/agregar-productos'], { queryParams: queryParamsObj });
    }
    else {
      this._router.navigate(['/mi-lista/agregar-productos']);
    }
  }

  public inicializarFiltros(availableFields, queryParams, queryString, totalItems) {
    this.totalItems = totalItems;
    this.availableFields = availableFields;
    this.queryParams = queryParams;
    if (this.queryParams.has('minPrice')) {
      this.minPrice = parseInt(this.queryParams.get('minPrice'));
    }
    if (this.queryParams.has('maxPrice')) {
      this.maxPrice = parseInt(this.queryParams.get('maxPrice'));
    }
    this.queryString = queryString;
    this._itemService.updateFilters(queryString).subscribe(
      response => {
        this.filtrosDisponibles = this.quitarDuplicados(response.result);
        this.configurarFiltrosActivos();
        this.viewHasLoaded = true;
      }, error => { console.error(error); }
    );
  }

  public toggleFiltros(idBloque) {
    let maxHeight = this.filtrosDisponibles[idBloque].length * 17;
    let actualHeightStr = document.getElementById(idBloque).style.height;
    let actualHeight = actualHeightStr ? parseInt(actualHeightStr.substring(0, actualHeightStr.length - 2)) : 0;

    if (actualHeight < maxHeight) {
      document.getElementById(idBloque).style.height = maxHeight + "px";
    } else {
      document.getElementById(idBloque).style.height = "200px";
    }
  }

  private quitarDuplicados(values: Map<String, Array<any>>) {
    if (!values || values.size === 0) {
      return new Map<String, Array<any>>();
    }

    if (values['groups']) {
      values['groups'] = values['groups'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    if (values['subgroups']) {
      values['subgroups'] = values['subgroups'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    if (values['brands']) {
      values['brands'] = values['brands'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    if (values['collection']) {
      values['collection'] = values['collection'].filter((option, index, self) => self.findIndex((t) => { return t === option; }) === index);
    }

    if (values['colors']) {
      values['colors'] = values['colors'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }

    if (values['materials']) {
      values['materials'] = values['materials'].filter((option, index, self) => self.findIndex((t) => { return t.code === option.code; }) === index);
    }
    return values;
  }

  private configurarFiltrosActivos() {
    this.filtrosAplicados = new Array<string[]>();
    for (let i = 0; i < this.availableFields.length; i++) {
      if (this.queryParams.has(this.availableFields[i])) {
        switch (this.availableFields[i]) {
          case 'group':
            let list = this.queryParams.get(this.availableFields[i]).split(',');
            for (let j = 0; j < list.length; j++) {
              this._itemService.findType('grupo', '?fieldValue=' + list[j]).subscribe(
                response => {
                  if (response.result && response.result[0][this.availableFields[i]].code) {
                    this.filtrosAplicados.push(['Grupo', response.result[0][this.availableFields[i]].name, 'group', response.result[0][this.availableFields[i]].code]);
                  }
                }, error => { console.error(error); }
              );
            }
            break;
          case 'subgroup':
            this._itemService.findType('subgrupo', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result.length > 0) {
                  for (let k = 0; k < response.result.length; k++) {
                    if (response.result[k].code) {
                      this.filtrosAplicados.push(['Subgrupo', response.result[k].name, 'subgroup', response.result[k].code]);
                    }
                  }
                }
              }, error => { console.error(error); }
            );
            break;
          case 'brand':
            this._itemService.findType('marca', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result[0].code) {
                  this.filtrosAplicados.push(['Marca', response.result[0].name, 'brand', response.result[0].code]);
                }
              }, error => { console.error(error); }
            );
            break;
          case 'color':
            this._itemService.findType('color', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result[0].code) {
                  this.filtrosAplicados.push(['Color', response.result[0].name, 'color', response.result[0].code]);
                }
              }, error => { console.error(error); }
            );
            break;
          case 'material':
            this._itemService.findType('material', '?fieldValue=' + this.queryParams.get(this.availableFields[i])).subscribe(
              response => {
                if (response.result && response.result[0].code) {
                  this.filtrosAplicados.push(['Material', response.result[0].name, 'material', response.result[0].code]);
                }
              }, error => { console.error(error); }
            );
            break;
          case 'minPrice':
            this.filtrosAplicados.push(['Precio mínimo', '$ desde ' + this.queryParams.get('minPrice'), 'minPrice']);
            break;
          case 'maxPrice':
            this.filtrosAplicados.push(['Precio máximo', '$ hasta ' + this.queryParams.get('maxPrice'), 'maxPrice']);
            break;
          case 'collection':
            this.filtrosAplicados.push(['Colección', this.queryParams.get('collection'), 'collection', this.queryParams.get('collection')]);
            break;
          case 'keywords':
            this.filtrosAplicados.push(['Palabras Claves', this.queryParams.get('keywords'), 'keywords', this.queryParams.get('keywords')]);
            break;
          default:
        }
      }
    }
  }

  public toggleSelection(tipoFiltro: string, codigo: string) {
    console.log('entra en toggleSelection');
    if (tipoFiltro.endsWith('Price')) {
      if (!codigo || codigo == null || codigo.length === 0) {
        if (this.queryParams.has(tipoFiltro)) {
          this.queryParams.delete(tipoFiltro);
        }
      } else {
        this.queryParams.set(tipoFiltro, codigo);
      }
    } else if (this.queryParams.has(tipoFiltro)) {
      let listStr: string = this.queryParams.get(tipoFiltro);
      let list: Array<string> = listStr.split(',');
      let pos = list.indexOf(codigo);
      if (pos >= 0) {
        list.splice(pos, 1);
        if (list.length > 0) {
          this.queryParams.set(tipoFiltro, list.join());
        } else {
          this.queryParams.delete(tipoFiltro);
        }
      } else {
        listStr = listStr.concat(',').concat(codigo);
        this.queryParams.set(tipoFiltro, listStr);
      }
    } else {
      this.queryParams.set(tipoFiltro, codigo);
    }
    this.navigateFilter();
  }

  public toggleClass(idComponent) {
    $(idComponent).toggleClass("icon-plus icon-minus");
  }

  public showCategoryOption(menuItem) {
    return !this.queryParams.has('group') || this.queryParams.get('group').split(',').indexOf(menuItem.code) == -1;
  }

  public abrirModal(itemcode) {
    this.inicializarForm();
    this.messageError = '';
    this.successMessage = '';
    this.valid = true;
    this._itemService.find(itemcode).subscribe(
      response => {
        this.formAgregar.itemcode = response.result[0].itemcode;
        this.formAgregar.name = response.result[0].itemname;
        this.formAgregar.image = 'https://img.matisses.co/' + response.result[0].itemcode + '/parrilla/' + response.result[0].itemcode + '_01.jpg';
        this.formAgregar.description = response.result[0].description;
        this.formAgregar.cantidad = 0;
      }
    );
    $('#modalAgregar').modal('show');
  }

  public agregarProducto(agregarForm) {
    let productoAgregar = {
      idLista: this.idListaUsuario,
      cantidadElegida: this.formAgregar.cantidad,
      referencia: this.formAgregar.itemcode,
      descripcionProducto: this.formAgregar.name,
      mensajeAgradecimiento: this.formAgregar.msjagradecimiento,
      favorito: 0,
      active: 1
    };
    this._listaService.agregarProducto(productoAgregar).subscribe(
      response => {
        if (response.codigo == "0") {
          for (let i = 0; i < this.items.length; i++) {
            //validar si el ítem tiene descuentos
            if (this.items[i].itemcode === productoAgregar.referencia) {
              this.items[i].agregadoLista = true;
            }
          }
          this.successMessage = "El producto fue agregado a tu lista corrrectamente";
          $('#modalAgregar').modal('hide');
          return;
        }
        else {
          this.messageError = "Ocurrio un error agregando el producto a tu lista." + ' ' + response.mensaje;
          return;
        }
      },
      error => {
        this.messageError = "Ocurrio un error agregando el producto a tu lista." + ' ' + error;
      }
    );
  }

  public aumentarCantidad() {
    this.formAgregar.cantidad += 1;
  }

  public reducirCantidad() {
    if (this.formAgregar.cantidad > 1) {
      this.formAgregar.cantidad -= 1;
    }
  }

  // public abrirModalFechaEntrega(modal: string) {
  //   this.buscarLista(this.codigoLista);
  //   $(modal).modal('show');
  // }

  public cerrarSession() {
    localStorage.removeItem('matisses.lista-token');
    localStorage.removeItem('username-lista');
    localStorage.removeItem('usuario-id');
    localStorage.removeItem('cambio-clave');
    localStorage.removeItem('id-lista');
    localStorage.removeItem('codigo-lista');
    localStorage.removeItem('fecha-evento');
    localStorage.removeItem('total-por-comprar');
    localStorage.removeItem('total-comprado');
    this._router.navigate(['/lista-de-regalos']);
    sessionStorage.removeItem('resultados');
    localStorage.removeItem('username-admin');
  }
}