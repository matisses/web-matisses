import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';

import { Item } from '../../models/item';
import { ItemService } from '../../services/item.service';
import { StockService } from '../../services/stock.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

declare var $: any;

@Component({
  templateUrl: 'producto.html',
  styleUrls: ['producto.component.css'],
  providers: [ItemService, StockService]
})
export class ProductoComponent implements OnInit, AfterViewInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public selectedQuantity: number = 1;
  public itemPosition: number = 0;
  public totalStock: number = 0;
  public existe360: boolean = false;
  public existeWow: boolean = false;
  public existePlantilla: boolean = false;
  public existenciaMedellin: boolean = false;
  public existenciaBogota: boolean = false;
  public item: Item;
  public quantityOptions: Array<number>;
  public images: Array<string>;
  public itemsRelacionados: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _stockService: StockService, private _http: Http) {
    this.quantityOptions = new Array<number>();
    this.images = new Array<string>();
    this.itemsRelacionados = new Array<any>();
  }

  ngOnInit() {
    console.log('inicializando componente de producto');
    this.cargarInfoItem();
    this._itemService.inicializarWishlist();
  }

  ngAfterViewInit() {
    this.carrito.cargarCarrito();
  }

  public getCSSClassName(item: Item) {
    return this._itemService.getCSSClassName(item);
  }

  public toggleWishList(item: Item) {
    this._itemService.toggleWishList(item);
  }

  private cargarInfoItem() {
    this.quantityOptions = new Array<number>();
    this._route.params.forEach((params: Params) => {
      let itemCode: string = params['item'];
      this._itemService.find(itemCode).subscribe(
        response => {
          this.item = response.result[0];
          console.log(this.item);
          this.validar360();
          this.validarWow();
          this.validarPlantilla();
          this.cargarInventario();
          this.obtenerRelacionados();
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  public botonDown() {
    console.log('has dado click al botón Down');
    $('.section').animate({ scrollTop: '+=300' }, 500);
    return false;
  }

  public botonUp() {
    console.log('has dado click al botón Up');
    $('.section').animate({ scrollTop: '-=300' }, 600);
    return false;
  }

  public agregarCarrito() {
    console.log('a');
    this.item.selectedQuantity = this.selectedQuantity;
    this.carrito.procesarItem(this.item);
    $('#carritoModal_' + this.carrito.id).modal('show');
  }

  public toggleClass(idComponent) {
    $(idComponent).toggleClass("icon-plus icon-minus");
  }

  public seleccionarCantidad(quantity: number) {
    this.selectedQuantity = quantity;
  }

  private validar360() {
    console.log('validando si existe el 360 para ref ' + this.item.itemcode);
    try {
      this._http.get('https://www.matisses.co/modules/matisses/files/' + this.item.itemcode + '/360/' + this.item.itemcode + '.html')
        .subscribe(
        response => {
          if (response.status === 200) {
            this.existe360 = true;
            document.getElementById('frame360').setAttribute('src', 'https://www.matisses.co/modules/matisses/files/' + this.item.itemcode + '/360/' + this.item.itemcode + '.html');
          } else {
            this.existe360 = false;
          }
        },
        error => {
          console.log('finalizo la validacion del 360 CON ERROR');
          this.existe360 = false;
        });
    } catch (e) {
      console.log('ocurrio un error al acceder a la ruta de la imagen');
    }
  }

  private validarWow() {
    console.log('validando si existe el wow para ref ' + this.item.itemcode);
    try {
      this._http.get('https://www.matisses.co/modules/matisses/files/' + this.item.itemcode + '/animacion/' + this.item.itemcode + '.html').subscribe(
        response => {
          if (response.status === 200) {
            this.existeWow = true;
            document.getElementById('frameWow').setAttribute('src', 'https://www.matisses.co/modules/matisses/files/' + this.item.itemcode + '/animacion/' + this.item.itemcode + '.html');
          } else {
            this.existeWow = false;
          }
        },
        error => {
          console.log('finalizo la validacion del WOW CON ERROR');
          this.existeWow = false;
        }
      );
    } catch (e) {
      console.log('ocurrio un error al acceder a la ruta de la imagen');
    }
  }

  private validarPlantilla() {
    console.log('validando si existe el plantilla para ref ' + this.item.itemcode);

    try {
      this._http.get('https://www.matisses.co/modules/matisses/files/' + this.item.itemcode + '/plantilla/' + this.item.itemcode + '.jpg').subscribe(
        response => {
          if (response.status === 200) {
            this.existePlantilla = true;
            document.getElementById('plantilla').setAttribute('src', 'https://www.matisses.co/modules/matisses/files/' + this.item.itemcode + '/plantilla/' + this.item.itemcode + '.jpg');
          } else {
            this.existePlantilla = false;
          }
        },
        error => {
          console.log('finalizo la validacion del plantilla CON ERROR');
          this.existePlantilla = false;
        }
      );
    } catch (e) {
      console.log('ocurrio un error al acceder a la ruta de la imagen');
      console.error(e);
    }
  }

  private cargarInventario() {
    this.existenciaMedellin = false;
    this.existenciaBogota = false;
    this.totalStock = 0;
    this._stockService.getStock(this.item.itemcode).subscribe(
      response => {
        this.item.stock = response.result;
        for (let i = 0; i < this.item.stock.length; i++) {
          this.totalStock += this.item.stock[i].quantity;
          if (!this.existenciaMedellin && (this.item.stock[i].whsCode.substring(0, 2) === '02' || this.item.stock[i].whsCode === '0101' || this.item.stock[i].whsCode === '0103')) {
            this.existenciaMedellin = true;
          } else if (!this.existenciaBogota && (this.item.stock[i].whsCode.substring(0, 2) === '03' || this.item.stock[i].whsCode === '0104')) {
            this.existenciaBogota = true;
          }
        }
        for (let i = 0; i < this.totalStock; i++) {
          this.quantityOptions.push(i + 1);
        }
      }, error => {
        console.log(error);
      }
    );
  }

  private obtenerRelacionados() {
    this.itemsRelacionados = new Array<any>();
    this._itemService.findRelatedItems(this.item.model).subscribe(
      response => {
        console.log(response.items);
        this.itemsRelacionados = response.items;
        console.log(this.itemsRelacionados);

        for (let i = 0; i < this.itemsRelacionados.length; i++) {
          this.itemsRelacionados[i].color.hexa = '#' + this.itemsRelacionados[i].color.hexa;
          console.log(this.itemsRelacionados[i].color.hexa);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public isInWishlist(item: Item) {
    return this._itemService.isInWishlist(item);
  }
}
