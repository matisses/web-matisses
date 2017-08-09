import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PlacetoPayService } from '../../services/placetopay.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

@Component({
  templateUrl: 'resultado-transaccion.html',
  styleUrls: ['resultado-transaccion.component.css'],
  providers: [PlacetoPayService, ShoppingCartService]
})

export class ResultadoTransacciComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

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
    //console.log('inicializando componente de resultado transaccion');
    this.carrito.cargarCarrito();
    this.consultarEstadoPlaceToPay();
  }

  consultarEstadoPlaceToPay() {
    this._route.params.forEach((params: Params) => {
      let idCarrito: string = params['idCarrito'];

      this._shoppingCartService.findShoppingCart(idCarrito).subscribe(
        response => {
          let items: [{}] = response.shoppingCart[0].items;

          if (items) {
            this._placetopayService.consultar(idCarrito, items).subscribe(
              response => {
                this.transaccion = response;

                if (this.transaccion.status.status === 'REJECTED') {
                  this.transaccion.status.reason = 'rechazada';
                } else {
                  this.transaccion.status.reason = 'aprobada';
                }
              },
              error => {
                console.log(error);
              }
            );
          }
        },
        error => {
          console.log(error);
        }
      );
    });
  }
}
