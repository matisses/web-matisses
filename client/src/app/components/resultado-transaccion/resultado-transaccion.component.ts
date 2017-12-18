import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PlacetoPayService } from '../../services/placetopay.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'resultado-transaccion.html',
  styleUrls: ['resultado-transaccion.component.css'],
  providers: [PlacetoPayService, ShoppingCartService]
})

export class ResultadoTransacciComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public errorMessage: string = '';
  public transaccion: {
    status: {
      message: string,
      status: string,
      reason: string
    },
    factura: number,
    referenciaPago: string,
    descripcionPago: string,
    nombrePagador: string,
    email: string,
    ip: string,
    fecha: string,
    valorTotal: number,
    impuestos: number
  }

  constructor(private _route: ActivatedRoute, private _router: Router, private _placetopayService: PlacetoPayService, private _shoppingCartService: ShoppingCartService) {
  }

  ngOnInit() {
    this.carrito.cargarCarrito();
    this.consultarEstadoPlaceToPay();
  }

  ngAfterViewInit() {
    setTimeout(function() {
      $(document).ready(function() {
        $('#modalVacaiones').modal('show')
      });
    }, 500); // Modal Vacaiones
  }

  consultarEstadoPlaceToPay() {
    this.errorMessage = '';
    this._route.params.forEach((params: Params) => {
      let idCarrito: string = params['idCarrito'];

      this._shoppingCartService.findShoppingCart(idCarrito).subscribe(
        response => {
          let datosCompraWeb = {
            metodoEnvio: response.shoppingCart[0].metodoEnvio,
            tiendaRecoge: response.shoppingCart[0].tiendaRecoge,
            idCarrito: idCarrito,
            items: response.shoppingCart[0].items
          }

          if (datosCompraWeb.items) {
            this._placetopayService.consultar(datosCompraWeb).subscribe(
              response => {
                if (response.codigo && response.codigo == -1) {
                  this.errorMessage = response.mensaje;
                } else {
                  this.transaccion = response;

                  if (this.transaccion.status.status === 'REJECTED') {
                    this.transaccion.status.reason = 'rechazada';
                  } else if (this.transaccion.status.status === 'PENDING') {
                    this.transaccion.status.reason = 'pendiente';
                  } else {
                    this.transaccion.status.reason = 'aprobada';
                  }
                }
              },
              error => {
                this.errorMessage = 'No se pudo conectar con el servidor';
                console.error(error);
              }
            );
          }
        },
        error => {
          console.error(error);
        }
      );
    });
  }
}
