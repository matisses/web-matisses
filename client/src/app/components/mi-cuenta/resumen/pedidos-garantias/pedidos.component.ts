import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'matisses-pedidos',
  templateUrl: 'pedidos.html',
  styleUrls: ['pedidos.component.css'],
})


export class PedidosComponent implements OnInit {
  public pedidos: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.pedidos = Array<any>();
  }

  ngOnInit() {
    this.forPedidos();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

public forPedidos() {
  this.pedidos.push({
    factura: "70000710",
    fecha: "03 | 02 | 2018",
    valor: "50000",
    estado: "entregado"
  });
  this.pedidos.push({
    factura: "70006710",
    fecha: "03 | 03 | 2018",
    valor: "1550000",
    estado: "entregado"
  });
  this.pedidos.push({
    factura: "7000610",
    fecha: "05 | 11 | 2018",
    valor: "5550000",
    estado: "transito"
  });
  this.pedidos.push({
    factura: "70000709",
    fecha: "03 | 11 | 2018",
    valor: "150000",
    estado: "despachado"
  });
  this.pedidos.push({
    factura: "60006710",
    fecha: "03 | 03 | 2018",
    valor: "1550000",
    estado: "cancelado"
  });
}

}
