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
  public materiales: Array<any>;
  public averias:Array<any>;
  public materialSeleccionado1:string='';
  public averiaSeleccionada:string='';
  public asunto:string;
  public comentario:string;
  public itemSeleccionado:string;
  public nombreItemSeleccionado:string;
  public facturaSeleccionada:string;
  public messageError:string;
  public successMessage:string;


  constructor(private _route: ActivatedRoute, private _router: Router, private _customerService: CustomerService, private _userService: SessionUsuarioService) {
    this.pedidos = Array<any>();
    this.items = Array<any>();
    this.materiales = Array<any>();
    this.averias = Array<any>();
    this.averiaSeleccionada='';
    this.materialSeleccionado1='';
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


  }

  public garantiaReclamar(itemcode:string, nombreItem:string, numeroFactura:string) {
    this.reclamarGarantia = true;

    //materialPorItem
    this._userService.materialPorItem(itemcode).subscribe(
      response => {
        this.materiales=response;
        this.itemSeleccionado=itemcode;
        this.nombreItemSeleccionado=nombreItem;
        this.facturaSeleccionada=numeroFactura;


      },
      error => {
        console.error(error);
      }
    );

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

  onChange($event) {

    this.materialSeleccionado = true;

    this._userService.averiasPorMaterial(this.materialSeleccionado1).subscribe(
      response => {

        this.averias=response;

      },
      error => {
        console.error(error);
      }
    );
    // I want to do something here for new selectedDevice, but what I
    // got here is always last selection, not the one I just select.
  }

  public crearLLamada(){

    if(this.averiaSeleccionada==null || this.averiaSeleccionada==''){
      this.messageError='Debes seleccionar un tipo de daño';
      return;
    }
    if(this.asunto==null || this.asunto==''){
      this.messageError='Debes agregar un asunto al reporte de daños';
      return;
    }
    if(this.comentario==null || this.comentario==''){
      this.messageError='Debes describir brevemente el daño de tu producto';
      return;
    }
    if(this.materialSeleccionado1==null || this.materialSeleccionado1==''){
      this.messageError='Debes seleccionar un tipo de material';
      return;
    }

    let direccionEnvio='';
    let telefonoEnvio='';
    let ciudadEnvio='';
    let paisEnvio='';
    let correoEnvio='';
    let direccionFactura='';
    let telefonoFactura='';
    let celularFactura='';
    let celularEnvio='';
    let ciudadFactura='';
    let paisFactura='';
    let nombreDireccionEnvio='';
    let nombreDireccionFactura='';
    for(let i = 0; i < this.customer.BPAddresses.BPAddress.length; i++) {
      if(this.customer.BPAddresses.BPAddress[i].AddressType=='bo_ShipTo'){
        direccionEnvio=this.customer.BPAddresses.BPAddress[i].Street;
        celularEnvio=this.customer.BPAddresses.BPAddress[i].BuildingFloorRoom;
        telefonoEnvio=this.customer.BPAddresses.BPAddress[i].Block;
        ciudadEnvio=this.customer.BPAddresses.BPAddress[i].City;
        paisEnvio=this.customer.BPAddresses.BPAddress[i].Country;
        nombreDireccionEnvio=this.customer.BPAddresses.BPAddress[i].AddressName;
      }
      if(this.customer.BPAddresses.BPAddress[i].AddressType=='bo_BillTo'){
        direccionFactura=this.customer.BPAddresses.BPAddress[i].Street;
        celularFactura=this.customer.BPAddresses.BPAddress[i].BuildingFloorRoom;
        telefonoFactura=this.customer.BPAddresses.BPAddress[i].Block;
        ciudadFactura=this.customer.BPAddresses.BPAddress[i].City;
        paisFactura=this.customer.BPAddresses.BPAddress[i].Country;
        nombreDireccionFactura=this.customer.BPAddresses.BPAddress[i].AddressName;
      }


    }

    let datosLlamada={
    "Subject": this.asunto,
    "CustomerCode": this.customer.CardCode,
    "CustomerName": this.customer.CardName,
    "ItemCode": this.itemSeleccionado,
    "ItemDescription": this.nombreItemSeleccionado,
    "Description": this.comentario,
    "AddressType": "bo_ShipTo",
    "U_Causa": "07",
    "U_CateGa": "01",
    "U_Num_factura": this.facturaSeleccionada,
    "U_Material": this.materialSeleccionado1,
    "U_ProblemaMaterial": this.averiaSeleccionada,
    "BPeMail": this.customer.County,
    "BPShipToCode": nombreDireccionEnvio,
    "BPShipToAddress": direccionEnvio+"\n" +ciudadEnvio +"\n"+paisEnvio,
    "BPBillToCode": nombreDireccionFactura,
    "BPBillToAddress": direccionFactura+"\n"+  ciudadFactura+"\n"+paisFactura,
    "BPPhone1": telefonoEnvio,
    "BPPhone2": telefonoFactura,
    "BPCellular": celularEnvio,
    "ServiceCallBPAddressComponents": {
        "ServiceCallBPAddressComponent": [
            {
                "ShipToStreet": direccionEnvio,
                "ShipToBlock": telefonoEnvio,
                "ShipToBuilding": celularEnvio,
                "ShipToCity": ciudadEnvio,
                "ShipToState": "",
                "ShipToCounty": this.customer.County,
                "ShipToCountry": paisEnvio,
                "BillToStreet": direccionFactura,
                "BillToBlock": telefonoFactura,
                "BillToBuilding": celularFactura,
                "BillToCity": ciudadFactura,
                "BillToState": "",
                "BillToCounty": this.customer.County,
                "BillToCountry": paisFactura,
                "BillToZipCode": null
            }
        ]
    }
}

this._userService.llamadaServicio(datosLlamada).subscribe(
  response => {
    if(response.estado=='0'){
      this.successMessage="Se ha creado correctamente su solicitud de garantía bajo el número "+response.content.content;
    }
    else{
      this.messageError="Ha ocurrido un error en la creación de su solicitud, por favor intente mas tarde";
    }

  },
  error => {
    console.error(error);
  }
);
  }

volverCuenta(){

  this._router.navigate(['/mi-cuenta']);
}
}
