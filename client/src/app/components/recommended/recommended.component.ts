import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../models/item';

import { RecommendedItemService } from '../../services/recommended.service';
import { ItemService } from '../../services/item.service';
import { DescuentosService } from '../../services/descuentos.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'recommended',
  templateUrl: 'recommended.html',
  styleUrls: ['recommended.component.css'],
  providers: [RecommendedItemService, ItemService, DescuentosService]
})

export class RecommendedComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public items: Array<Item>;

  constructor(private _recommmendedService: RecommendedItemService, private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router,
    private _descuentosService: DescuentosService) {
  }

  ngOnInit() {
    this.inicializarItems();
    this._itemService.inicializarWishlist();
  }

  ngAfterViewInit() {

  }

  private inicializarItems() {
    this.items = new Array<Item>();

    this._recommmendedService.list().subscribe(
      response => {
        for (let i = 0; i < response.result.length; i++) {
          let item: Item;
          item = response.result[i].item_data;
          //validar si el ítem tiene descuentos
          this._descuentosService.findDiscount(item.itemcode).subscribe(
            response => {
              if (item.priceaftervat === response.precio) {
                if (response.descuentos && response.descuentos.length > 0) {
                  item.descuento = response.descuentos[0].porcentaje;
                  item.priceafterdiscount = item.priceaftervat - ((item.priceaftervat / 100) * item.descuento);
                }
              }
            },
            error => {
              console.error(error);
            }
          );
          this.items.push(item);
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  mostrarArticulo(articulo) {
  }

  public slickRecommended() {
    $(".slider-recommended").slick({
      prevArrow: '.slider-recommended-container .prev',
      nextArrow: '.slider-recommended-container .next',
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }

  public botonRight() {
    $('.section').animate({ scrollLeft: '+=890' }, 500);
    return false;
  }

  public botonLeft() {
    $('.section').animate({ scrollLeft: '-=890' }, 500);
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
