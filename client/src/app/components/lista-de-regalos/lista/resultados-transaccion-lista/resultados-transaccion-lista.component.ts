import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PlacetoPayService } from '../../../../services/placetopay.service';
import { ShoppingCartService } from '../../../../services/shopping-cart.service';

import { CarritoRegalosComponent } from '../carrito-regalos/carrito-regalos.component';
import { CarritoRegalosSimpleComponent } from '../carrito-regalos/carrito-regalos-simple.component';
@Component({
  templateUrl: 'resultados-transaccion-lista.html',
  styleUrls: ['resultados-transaccion-lista.component.css'],
    providers: [PlacetoPayService, ShoppingCartService]
})

export class ResultadoTransaccionListaComponent implements OnInit {

  @ViewChild(CarritoRegalosSimpleComponent) carrito: CarritoRegalosSimpleComponent;

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
  public codigoLista:string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _placetopayService: PlacetoPayService, private _shoppingCartService: ShoppingCartService) {
  }

  ngOnInit() {
    this.codigoLista=localStorage.getItem('codigo-lista');
    this.carrito.cargarCarrito();
    this.consultarEstadoPlaceToPay();
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
            items: response.shoppingCart[0].items,
            idLista:localStorage.getItem('id-lista')
          }

          if (datosCompraWeb.items.length>0) {
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
          else{
            console.log('entro por el else a validar transaccion');
            this._placetopayService.consultarBono(datosCompraWeb).subscribe(
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
