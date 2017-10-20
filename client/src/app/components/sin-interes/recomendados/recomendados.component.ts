import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../../models/item';
import { ItemService } from '../../../services/item.service';
import { DescuentosService } from '../../../services/descuentos.service'; 0 | 1

import { CarritoSimpleComponent } from '../../header/menu/carrito/carrito-simple.component';

declare var $: any;

@Component({
  selector: 'productos-recomendados',
  templateUrl: 'recomendados.html',
  providers: [ItemService, DescuentosService],
  styleUrls: ['recomendados.component.css']
})

export class RecomendadosComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public items: Array<Item>;
  public articuloActivo: number = 1;

  constructor(private _itemService: ItemService, private _route: ActivatedRoute, private _router: Router, private _descuentosService: DescuentosService) {
  }

  ngOnInit() {
    this.inicializarItems();
    this._itemService.inicializarWishlist();
  }

  ngAfterViewInit() {
    setTimeout(function() {
      $("#title").click();
    }, 2000);
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('2090044').subscribe(
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('2190016').subscribe(
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('2210050').subscribe(
              response => {
                this.items.push(response.result[0]);
                this._itemService.find('2420002').subscribe(
                  response => {
                    this.items.push(response.result[0]);
                    this._itemService.find('1051744').subscribe(
                      response => {
                        this.items.push(response.result[0]);
                        this._itemService.find('2410069').subscribe(
                          response => {
                            this.items.push(response.result[0]);
                            this._itemService.find('2310654').subscribe(
                              response => {
                                this.items.push(response.result[0]);
                                this._itemService.find('2210031').subscribe(
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

  public slick() {
    $(".slider").slick({
      prevArrow: '.slider-container .prev',
      nextArrow: '.slider-container .next',
      slidesToShow: 4,
      slidesToScroll: 2,
      responsive: [
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
    $('.section').animate({ scrollLeft: '+=370' }, 500);
    return false;
  }

  public botonLeft() {
    $('.section').animate({ scrollLeft: '-=370' }, 500);
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
