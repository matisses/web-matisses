import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PlacetoPayService } from '../../services/placetopay.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

@Component({
  templateUrl: 'resultado-transaccion.html',
  styleUrls: ['resultado-transaccion.component.css'],
  providers: [PlacetoPayService]
})

export class ResultadoTransacciComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public mensaje: string;
  public descripcion: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _placetopayService: PlacetoPayService) {
    this.mensaje = 'Lo sentimos, tu pago no se ha completado';
    this.descripcion = 'Transacción rechazada';
  }

  ngOnInit() {
    console.log('inicializando componente de resultado transaccion');
    this.carrito.cargarCarrito();
    this.consultarEstadoPlaceToPay();
  }

  consultarEstadoPlaceToPay(){
    this._placetopayService.consultar(this.carrito.shoppingCart._id, this.carrito.shoppingCart.items).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }
}
