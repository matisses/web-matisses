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
  public items: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.pedidos = Array<any>();
    this.items = Array<any>();
  }

  ngOnInit() {
    this.forPedidos();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
    this.forItem();        
  }

  public verDetalles() {
    $('#modalDetalle').modal('show');
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
    estado: "tránsito"
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

public forItem() {
  this.items.push({
    itemcode: "10500000000000001831",
    shortitemcode: "1051831",
    itemname: "SILLA OCASIONAL EN TELA",
    priceaftervat: "2490000",
    selectedQuantity: "2",
    estado: ""
  });
  this.items.push({
    itemcode: "20900000000000000108",
    shortitemcode: "2090108",
    itemname: "SOFÁ 3 PUESTOS DUCA EN TELA",
    priceaftervat: "10880000",
    selectedQuantity: "1",
    estado: ""
  });
  this.items.push({
    itemcode: "22100000000000000041",
    shortitemcode: "2210041",
    itemname: "SET/4 MESAS EN METAL",
    priceaftervat: "4475000",
    selectedQuantity: "1",
    estado: "Reclamar"
  });
}

}
