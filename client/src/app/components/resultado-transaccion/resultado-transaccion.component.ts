import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  templateUrl: 'resultado-transaccion.html',
  styleUrls: ['resultado-transaccion.component.css']
})

export class ResultadoTransacciComponent implements OnInit {
  public mensaje: string;
  public descripcion: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.mensaje = 'Lo sentimos, tu pago no se ha completado';
    this.descripcion = 'Transacción rechazada';
  }

  ngOnInit() {
    console.log('inicializando componente de resultado transaccion');
  }
}
