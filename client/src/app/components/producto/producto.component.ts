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
  public existe360: boolean = false;
  public existeWow: boolean = false;
  public existePlantilla: boolean = false;
  public item: Item;
  public quantityOptions: Array<number>;
  public images: Array<string>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _stockService: StockService, private _http: Http) {
    this.quantityOptions = new Array<number>();
    this.images = new Array<string>();
  }

  ngOnInit() {
    console.log('inicializando componente de producto');
    this.cargarInfoItem();
  }

  ngAfterViewInit() {
    this.carrito.cargarCarrito();
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
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  public agregarCarrito() {
    this.item.selectedQuantity = this.selectedQuantity;
    this.carrito.procesarItem(this.item);
  }

  public toggleClass(idComponent) {
    $(idComponent).toggleClass("icon-plus icon-minus");
  }

  public seleccionarCantidad(quantity) {
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

  private validarPlantilla(){
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
    this._stockService.getStock(this.item.itemcode).subscribe(
      response => {
        let totalStock = 0;
        this.item.stock = response.result;
        for (let i = 0; i < this.item.stock.length; i++) {
          totalStock += this.item.stock[i].quantity;
        }
        for (let i = 0; i < totalStock; i++) {
          this.quantityOptions.push(i + 1);
        }
      }, error => {
        console.log(error);
      }
    );
  }
}
