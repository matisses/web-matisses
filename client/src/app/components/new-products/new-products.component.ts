import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';
import { ItemService } from '../../services/item.service';
import { DescuentosService } from '../../services/descuentos.service'; 0 | 1

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

declare var $: any;

@Component({
  selector: 'new-products',
  templateUrl: 'newproducts.html',
  providers: [ItemService, DescuentosService],
  styleUrls: ['newproducts.component.css']
})

export class NewProductsComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public title: string;
  public items: Array<Item>;
  public articuloActivo: number = 1;

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router, private _descuentosService: DescuentosService) {
  }

  ngOnInit() {
    //console.log('inicializando componente de nuevos productos');
    this.inicializarItems();
    this._itemService.inicializarWishlist();
  }

  ngAfterViewInit() {
    //console.log('termino de cargar el componente');
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.listNewItems().subscribe(
      response => {
        if (response.result.length > 3) {
          let pos1 = (Math.random() * response.result.length) | 0;
          let pos2 = (Math.random() * response.result.length) | 0;
          let pos3 = (Math.random() * response.result.length) | 0;

          while (pos1 === pos2) {
            pos2 = (Math.random() * response.result.length) | 0;
          }
          while (pos1 === pos3 || pos2 == pos3) {
            pos3 = (Math.random() * response.result.length) | 0;
          }

          this.items.push(response.result[pos1]);
          this.items.push(response.result[pos2]);
          this.items.push(response.result[pos3]);
        } else {
          this.items = response.result;
        }

        for (let i = 0; i < this.items.length; i++) {
          //validar si el ítem tiene descuentos
          this._descuentosService.findDiscount(this.items[i].itemcode).subscribe(
            response => {
              if (this.items[i].priceaftervat === response.precio) {
                if (response.descuentos && response.descuentos.length > 0) {
                  this.items[i].descuento = response.descuentos[0].porcentaje;
                  this.items[i].priceafterdiscount = this.items[i].priceaftervat - ((this.items[i].priceaftervat / 100) * this.items[i].descuento);
                }
              }
            },
            error => {
              console.error(error);
            }
          );
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  mostrarArticulo(articulo) {
    console.log(articulo);
  }

  public botonRight() {
    console.log('has dado click al botón right');
    $('.section').animate({ scrollLeft: '+=300' }, 500);
    return false;
  }

  public botonLeft() {
    console.log('has dado click al botón right');
    $('.section').animate({ scrollLeft: '-=300' }, 500);
    return false;
  }

  public toggleWishList(item: Item) {
    this._itemService.toggleWishList(item);
  }

  public isInWishlist(item: Item) {
    return this._itemService.isInWishlist(item);
  }

  public getCSSClassName(item: Item) {
    return this._itemService.getCSSClassName(item);
  }

  public agregarCarrito(item: Item) {
    item.selectedQuantity = 1;
    this.carrito.procesarItem(item);
  }
}
