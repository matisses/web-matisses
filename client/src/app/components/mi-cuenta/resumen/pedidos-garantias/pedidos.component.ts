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
  providers: [CustomerService, CityService, SessionUsuarioService]
})


export class PedidosComponent implements OnInit {
  public pedidos: Array<any>;
  public items: Array<any>;
  public customer: any;
  public detallePedido: any;
  public documentCustomer: string;
  public nombreUsuario: string;
  public detalles: number = null;
  public reclamarGarantia: boolean = false;
  public materialSeleccionado: boolean = false;

  constructor(private _route: ActivatedRoute, private _router: Router, private _customerService: CustomerService, private _userService: SessionUsuarioService) {
    this.pedidos = Array<any>();
    this.items = Array<any>();
  }

  ngOnInit() {
    this.documentCustomer = localStorage.getItem('doc-customer');
    this.nombreUsuario = localStorage.getItem('nombre-usuario');
    this.buscarCliente();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
    $(document).on('ready', function () {
      $("#input-b5").fileinput({ showCaption: false, dropZoneEnabled: false });
    });
  }

  public seleccionarMaterial() {
    this.materialSeleccionado = true;
    console.log(this.materialSeleccionado);

  }

  public garantiaReclamar() {
    this.reclamarGarantia = true;
    console.log(this.reclamarGarantia);

  }

  public verDetalles(pedido) {
    this.items = new Array<any>();
    this.inicializarInfoDetalle();
    this.detalles = pedido;

    this._userService.detallePedido(pedido).subscribe(
      response => {
        for (let i = 0; i < response.length; i++) {

          this.detallePedido = {
            'numeroFactura': response[0].nroPedido,
            'fechaFactura': response[0].formateoFechaPedido,
            'estadoFactura': response[0].ordenVenta,
            'cliente': response[0].cliente,
            'direccionEntrega': response[0].direccionEntrega,
            'ciudad': response[0].ciudadEntrega,
            'departamentoEntrega': response[0].departamentoEntrega,
            'telefono': response[0].telefono,
            'celular': response[0].celular
          };
          let estado = '';
          if (response[i].garantia) {
            estado = 'Reclamar'
          }
          this.items.push({
            itemcode: response[i].item.substring(0, 3) + '0000000000000' + response[i].item.substring(4),
            shortitemcode: response[i].item.substring(0, 3) + response[i].item.substring(4),
            itemname: response[i].producto,
            priceaftervat: response[i].precioUnitario,
            selectedQuantity: response[i].cantidad,
            estado: estado
          });
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  public volverPedidos() {
    this.detalles = null;
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

  public verPedidos(documento: string) {
    this.pedidos = new Array<any>();
    this._userService.verPedidos(documento).subscribe(
      response => {
        for (let i = 0; i < response.length; i++) {
          let estado = '';
          if (response[i].despachado) {
            estado = 'entregado'
          }
          if (response[i].ordenVenta == 'PENDIENTE') {
            estado = 'pendiente'
          }
          if (response[i].devolucion) {
            estado = 'cancelado'
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

  public inicializarInfoDetalle() {

    this.detallePedido = {
      'numeroFactura': '',
      'fechaFactura': '',
      'estadoFactura': '',
      'cliente': '',
      'direccionEntrega': '',
      'ciudad': '',
      'departamentoEntrega': '',
      'telefono': '',
      'celular': ''
    }

  }

}
