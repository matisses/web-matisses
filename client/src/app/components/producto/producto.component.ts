import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
  public quantityOptions: Array<number>;
  public images: Array<string>;
  public item: Item;
  public totalStock: number = 0;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _stockService: StockService) {
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
          this._stockService.getStock(itemCode).subscribe(
            response => {
              this.totalStock = 0;
              this.item.stock = response.result;
              for (let i = 0; i < this.item.stock.length; i++) {
                this.totalStock += this.item.stock[i].quantity;
              }
              //for (let i = 0; i < totalStock; i++) {
              //  this.quantityOptions.push(i + 1);
              //}
            }, error => {
              console.log(error);
            }
          );
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
    this.item.selectedQuantity = this.selectedQuantity;
    this.carrito.procesarItem(this.item);
  }

  public toggleClass(idComponent) {
    $(idComponent).toggleClass("icon-plus icon-minus");
  }

  public seleccionarCantidad(quantity) {
    this.selectedQuantity = quantity;
  }
}
