import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Customer } from '../../../../models/customer';
import { SessionUsuarioService } from '../../../../services/session-usuario.service';
import { CustomerService } from '../../../../services/customer.service';
import { CityService } from '../../../../services/city.service';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'matisses-pedidos',
  templateUrl: 'pedidos.html',
  styleUrls: ['pedidos.component.css'],
  providers: [CustomerService, CityService,SessionUsuarioService]
})


export class PedidosComponent implements OnInit {
  public pedidos: Array<any>;
  public items: Array<any>;
  public customer: any;
  public documentCustomer:string;
  public nombreUsuario: string;

  constructor(private _route: ActivatedRoute, private _router: Router,private _customerService: CustomerService,private _userService: SessionUsuarioService) {
    this.pedidos = Array<any>();
    this.items = Array<any>();
  }

  ngOnInit() {
    this.documentCustomer=localStorage.getItem('doc-customer');
    this.nombreUsuario=localStorage.getItem('nombre-usuario');
    this.buscarCliente();
    //this.forPedidos();
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

  public buscarCliente() {

if (this.nombreUsuario != null && this.nombreUsuario.length > 0) {
  this._userService.cargarcliente(this.nombreUsuario).subscribe(
    response => {
      this.customer = response;
      this.verPedidos(this.documentCustomer);
    },
    error => {
      console.error(error);
    }
  );
}
  }

  public verPedidos(documento:string){
    this.pedidos = new Array<any>();
    this._userService.verPedidos('14928197').subscribe(
      response => {
       for(let i = 0; i < response.length; i++) {
         let estado='';
          if(response[i].despachado){
            estado='despachado'
          }
          if(response[i].ordenVenta=='PENDIENTE'){
            estado='pendiente'
          }
          if(response[i].devolucion){
            estado='devuelto'
          }
          this.pedidos.push({
            factura: response[i].nroPedido,
            fecha: response[i].formateoFechaPedido,
            valor: response[i].totalPedido,
            estado: estado
          });
      }
      },
      error => {
        console.error(error);
      }
    );

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
