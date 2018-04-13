import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { MetaService } from '@ngx-meta/core';

import { Item } from '../../models/item';
import { ItemService } from '../../services/item.service';
import { StockService } from '../../services/stock.service';
import { DescuentosService } from '../../services/descuentos.service';
import { CotizacionService } from '../../services/cotizacion.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

declare var $: any;

@Component({
  templateUrl: 'producto.html',
  styleUrls: ['producto.component.css'],
  providers: [ItemService, StockService, DescuentosService, CotizacionService]
})

export class ProductoComponent implements OnInit, AfterViewInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public selectedQuantity: number = 1;
  public itemPosition: number = 0;
  public totalStock: number = 0;
  public cuotaMCO: number = 0;
  public pasoCotizacion: number = 1;
  public nombreCotizacion: string;
  public emailCotizacion: string;
  public mensajeError: string;
  public existe360: boolean = false;
  public existeWow: boolean = false;
  public existePlantilla: boolean = false;
  public existenciaMedellin: boolean = false;
  public existenciaBogota: boolean = false;
  public valid: boolean = true;
  public item: Item;
  public quantityOptions: Array<number>;
  public images: Array<string>;
  public itemsRelacionados: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _stockService: StockService,
    private _http: Http, private readonly meta: MetaService, private _descuentosService: DescuentosService, private _cotizacionService: CotizacionService) {
    this.quantityOptions = new Array<number>();
    this.images = new Array<string>();
    this.itemsRelacionados = new Array<any>();
  }

  ngOnInit() {
    this.cargarInfoItem();
    this._itemService.inicializarWishlist();
    $(function () {
      $('[data-toggle="popover"]').popover()
    })
    $("#popover1").hover(function () {
      $("#popover1").click();
    });
    $("#popover2").hover(function () {
      $("#popover2").click();
    });
    $('#modalSolicitud').on('shown.bs.modal', function () {
      $('#name').focus()
    });
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  ngAfterViewInit() {
    this.carrito.cargarCarrito();
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

  public getCSSClassName(item: Item) {
    return this._itemService.getCSSClassName(item);
  }

  public toggleWishList(item: Item) {
    this._itemService.toggleWishList(item);
  }

  private cargarInfoItem() {
    this.selectedQuantity = 1;
    this.quantityOptions = new Array<number>();
    this._route.params.forEach((params: Params) => {
      let itemCode: string = params['item'];
      this._itemService.find(itemCode).subscribe(
        response => {
          this.item = response.result[0];

          let urlImage: string = 'https://img.matisses.co/' + this.item.itemcode + '/images/' + this.item.itemcode + '_01.jpg';
          //this.meta.setTitle(`Matisses - Producto {{this.item.shortitemcode}}`);
          this.meta.setTag('og:image', urlImage);
          this.meta.setTag('og:description', this.item.description);
          this.meta.setTag('og:title', this.item.itemname);

          this.validar360();
          this.validarWow();
          this.validarPlantilla();
          this.cargarInventario();
          this.obtenerRelacionados();

          this.cuotaMCO = Math.round(this.item.priceaftervat / 12);

          //validar si el ítem tiene descuentos
          this._descuentosService.findDiscount(this.item.itemcode).subscribe(
            response => {
              if (this.item.priceaftervat === response.precio) {
                if (response.descuentos && response.descuentos.length > 0) {
                  this.item.descuento = response.descuentos[0].porcentaje;
                  this.item.priceafterdiscount = this.item.priceaftervat - ((this.item.priceaftervat / 100) * this.item.descuento);
                }
              }
            },
            error => {
              console.error(error);
            }
          );
        },
        error => {
          console.error(error);
        }
      );
    });
  }

  public botonDown() {
    $('.section').animate({ scrollTop: '+=300' }, 500);
    return false;
  }

  public botonUp() {
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

  public seleccionarCantidad(quantity: number) {
    this.selectedQuantity = quantity;
  }

  private validar360() {
    try {
      this._http.get('https://img.matisses.co/' + this.item.itemcode + '/360/' + this.item.itemcode + '.html')
        .subscribe(
          response => {
            if (response.status === 200) {
              this.existe360 = true;
              document.getElementById('frame360').setAttribute('src', 'https://img.matisses.co/' + this.item.itemcode + '/360/' + this.item.itemcode + '.html');
            } else {
              this.existe360 = false;
            }
          },
          error => {
            this.existe360 = false;
          });
    } catch (e) {
      console.error('ocurrio un error al acceder a la ruta de la imagen');
    }
  }

  private validarWow() {
    try {
      this._http.get('https://img.matisses.co/' + this.item.itemcode + '/animacion/' + this.item.itemcode + '.html').subscribe(
        response => {
          if (response.status === 200) {
            this.existeWow = true;
            document.getElementById('frameWow').setAttribute('src', 'https://img.matisses.co/' + this.item.itemcode + '/animacion/' + this.item.itemcode + '.html');
          } else {
            this.existeWow = false;
          }
        },
        error => {
          this.existeWow = false;
        }
      );
    } catch (e) {
      console.error('ocurrio un error al acceder a la ruta de la imagen');
    }
  }

  private validarPlantilla() {
    try {
      this._http.get('https://img.matisses.co/' + this.item.itemcode + '/plantilla/' + this.item.itemcode + '.jpg').subscribe(
        response => {
          if (response.status === 200) {
            this.existePlantilla = true;
            document.getElementById('plantilla').setAttribute('src', 'https://img.matisses.co/' + this.item.itemcode + '/plantilla/' + this.item.itemcode + '.jpg');
          } else {
            this.existePlantilla = false;
          }
        },
        error => {
          this.existePlantilla = false;
        }
      );
    } catch (e) {
      console.error('ocurrio un error al acceder a la ruta de la imagen', e);
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
        console.error(error);
      }
    );
  }

  private obtenerRelacionados() {
    this.itemsRelacionados = new Array<any>();
    this._itemService.findRelatedItems(this.item.model).subscribe(
      response => {
        this.itemsRelacionados = response.items;
        for (let i = 0; i < this.itemsRelacionados.length; i++) {
          this.itemsRelacionados[i].color.hexa = '#' + this.itemsRelacionados[i].color.hexa;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  public isInWishlist(item: Item) {
    return this._itemService.isInWishlist(item);
  }

  public printProductInfo() {
    var prtContent = document.getElementById("product_container");
    var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.write(prtContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  }

  public aumentarCantidad() {
    if (this.item.availablestock > this.selectedQuantity) {
      this.selectedQuantity += 1;
    }
  }

  public reducirCantidad() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity -= 1;
    }
  }

  public solicitarCotizacion(contactForm) {
    console.log('Se mandara la cotizacion');
    this.mensajeError = '';
    if (this.nombreCotizacion == null || this.nombreCotizacion.length <= 0 || this.emailCotizacion == null || this.emailCotizacion.length <= 0) {
      this.mensajeError = 'Debe llenar todos los datos necesarios para la cotización';
      return;
    }

    this._cotizacionService.create(this.item.itemcode, this.nombreCotizacion, this.emailCotizacion).subscribe(
      response => {
        if (response.estado === 0) {
          contactForm.reset();
          this.valid = true;
          this.nombreCotizacion = null;
          this.emailCotizacion = null;
          this.pasoCotizacion = 2;
        } else {
          this.mensajeError = 'No fue posible enviar la cotización solicitada';
        }
      },
      error => { console.error(error); }
    );
  }

  public cerrarModalCotizacion() {
    this.pasoCotizacion = 1;

    $('#modalSolicitud').modal('hide');
  }
}
