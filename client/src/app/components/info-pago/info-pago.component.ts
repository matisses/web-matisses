import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Customer } from '../../models/customer';
import { Item } from '../../models/item';
import { City } from '../../models/city';
import { ShippingMethod } from '../../models/shipping-method';
import { DatosPagoPlaceToPay } from '../../models/datos-pago-placetopay';

import { CustomerService } from '../../services/customer.service';
import { CityService } from '../../services/city.service';
import { ShippingMethodService } from '../../services/shipping-method.service';
import { PlacetoPayService } from '../../services/placetopay.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ItemService } from '../../services/item.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

declare var $: any;

@Component({
  templateUrl: 'info-pago.html',
  styleUrls: ['info-pago.component.css'],
  providers: [CustomerService, CityService, ShippingMethodService, PlacetoPayService, ShoppingCartService, ItemService]
})

export class InfoPagoComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  public carrito: CarritoSimpleComponent;

  public totalEnvio: number = 0;
  public messageError: string;
  public tiendaSeleccionada: string = 'Medellín';
  public procesandoP2P: boolean = false;
  public valid: boolean = true;
  public customer: Customer;
  public metodoEnvioSeleccionado: ShippingMethod = null;
  public datosPago: DatosPagoPlaceToPay = null;
  public ciudadesPrincipales: Array<City>;
  public otrasCiudades: Array<City>;
  public metodosEnvio: Array<ShippingMethod>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _customerService: CustomerService, private _cityService: CityService,
    private _shippingMethodService: ShippingMethodService, private _placetopayService: PlacetoPayService, private _shoppingCartService: ShoppingCartService,
    private _itemService: ItemService) {
    this.messageError = '';
    this.customer = new Customer().newCustomer('', '', null, '', '', '', '', '', '', '', '', null, '', '', '', '', '', '', [{
      stateCode: null,
      stateName: null,
      cityCode: null,
      cityName: null,
      addressName: null,
      addressType: null,
      address: null,
      landLine: null,
      cellphone: null,
      email: null,
      country: null,
      taxCode: null
    }]);
    this.ciudadesPrincipales = new Array<City>();
    this.otrasCiudades = new Array<City>();
    this.metodosEnvio = new Array<ShippingMethod>();
  }

  ngOnInit() {
    //console.log('inicializando componente de información de pago');
    this.carrito.cargarCarrito();
    this.obtenerMetodosEnvio();
    this.obtenerCiudades();
  }

  public obtenerCiudades() {
    this.ciudadesPrincipales = new Array<City>();
    this.otrasCiudades = new Array<City>();
    this._cityService.findPrincipalCities().subscribe(
      response => {
        this.ciudadesPrincipales = response.cities;
      },
      error => {
        console.log(error);
      }
    );
    this._cityService.findOtherCities().subscribe(
      response => {
        this.otrasCiudades = response.cities;
      },
      error => {
        console.log(error);
      }
    );
  }

  public obtenerMetodosEnvio() {
    this.metodosEnvio = new Array<ShippingMethod>();
    this._shippingMethodService.listShippingMethods().subscribe(
      response => {
        this.metodosEnvio = response;
        console.log(this.metodosEnvio);
      },
      error => {
        console.log(error);
      }
    );
  }

  public buscarCliente() {
    this.customer.fiscalID = this.customer.fiscalID.trim();
    this.messageError = '';
    if (this.customer.fiscalID != null && this.customer.fiscalID.length > 0) {
      this._customerService.getCustomerData(this.customer.fiscalID).subscribe(
        response => {
          if (response.fiscalIdType == '31') {
            console.log('El documento no es válido para facturar por este medio: ' + response.fiscalID + ' Tipo Doc: ' + response.fiscalIdType + '-Nit');
            this.messageError = 'Este documento no es válido para facturar por este sitio, esta registrado actualmente como NIT.';
            this.customer = this.customer = new Customer().newCustomer('', '', null, '', '', '', '', '', '', '', '', null, '', '', '', '', '', '', [{
              stateCode: null,
              stateName: null,
              cityCode: null,
              cityName: null,
              addressName: null,
              addressType: null,
              address: null,
              landLine: null,
              cellphone: null,
              email: null,
              country: null,
              taxCode: null
            }]);
            this.valid = false;
            return;
          }
          this.customer = response;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public pagar() {
    this.valid = true;
    this.messageError = '';
    if (this.metodoEnvioSeleccionado == null || this.metodoEnvioSeleccionado.code == 0) {
      console.log('Se debe seleccionar un método de envió');
      this.messageError = 'Se debe seleccionar un método de envió.';
      return;
    }
    if (this.metodoEnvioSeleccionado.code == 2 && (this.tiendaSeleccionada == null || this.tiendaSeleccionada.length <= 0)) {
      console.log('Debe seleccionar en cual tienda desea recoger los artículos');
      this.messageError = 'Debe seleccionar en cual tienda desea recoger los artículos.';
      return;
    } else if (this.metodoEnvioSeleccionado.code != 2) {
      this.tiendaSeleccionada = null;
    }
    if (this.customer.fiscalID == null || this.customer.fiscalID.length <= 0
      || this.customer.firstName == null || this.customer.firstName.length <= 0
      || this.customer.lastName1 == null || this.customer.lastName1.length <= 0
      || this.customer.fiscalIdType == null || this.customer.fiscalIdType.length <= 0
      || this.customer.addresses[0].address == null || this.customer.addresses[0].address.length <= 0
      || this.customer.addresses[0].cellphone == null || this.customer.addresses[0].cellphone.length <= 0
      || this.customer.addresses[0].cityCode == null || this.customer.addresses[0].cityCode == 0
      || this.customer.addresses[0].email == null || this.customer.addresses[0].email.length <= 0) {
      console.log('Se deben llenar todos los campos obligatorios para poder proceder con el pago');
      this.messageError = 'Se deben llenar todos los campos obligatorios para poder proceder con el pago.';
      this.valid = false;
      return;
    }
    this.procesandoP2P = true;

    this._itemService.validarItems(this.carrito.shoppingCart.items).subscribe(
      response => {
        let itemsSinSaldo = false;
        let items: Array<Item> = response;

        for (let i = 0; i < items.length; i++) {
          for (let j = 0; j < this.carrito.shoppingCart.items.length; j++) {
            if (items[i].itemcode === this.carrito.shoppingCart.items[j].itemcode && items[i].sinSaldo) {
              this.carrito.shoppingCart.items[j].sinSaldo = true;
              itemsSinSaldo = true;
              break;
            }
          }
        }

        console.log(items);

        if (itemsSinSaldo) {
          //Devolver a la vista de carrito para notificarle al usuario que los items no tienen saldo
          localStorage.setItem('matisses.shoppingCart', JSON.stringify(this.carrito.shoppingCart));
          this._router.navigate(['/resumen-carrito']);
        } else {
          //Se mapean los datos para guardar el carrito en mongo DB

          let shoppingCart = {
            metodoEnvio: this.metodoEnvioSeleccionado.code,
            tiendaRecoge: this.tiendaSeleccionada,
            fechacreacion: null,
            items: this.carrito.shoppingCart.items
          }

          this._shoppingCartService.saveShoppingCart(shoppingCart).subscribe(
            response => {
              //Se guarda en el localStorage el carrito
              this.carrito.shoppingCart._id = response.shoppingCart._id;
              localStorage.setItem('matisses.shoppingCart', JSON.stringify(this.carrito.shoppingCart));
              this.validarCliente(this.carrito.shoppingCart._id);
            },
            error => {
              console.log(error);
            }
          );
        }
      },
      error => {
        console.log(error);
        this.procesandoP2P = false;
      }
    );
  }

  private validarCliente(_idCarrito) {
    console.log('Mandando datos del cliente');
    this.obtenerNombreCiudad();

    this._customerService.getCustomerData(this.customer.fiscalID).subscribe(
      response => {
        //Mandar directo a placetopay
        this.enviarPlaceToPay(_idCarrito);
      },
      error => {
        //Se debe mandar a crear el cliente en SAP
        let apellidos = '';
        let nacionalidad = '';
        apellidos += this.customer.lastName1;
        if (this.customer.lastName2 != null && this.customer.lastName2.length > 0) {
          apellidos += ' ' + this.customer.lastName2;
        }
        if (this.customer.nationality === 'NATIONAL') {
          nacionalidad = 'NATIONAL';
        } else {
          nacionalidad = 'FOREIGN';
        }

        let businesspartner = {
          birthDate: '1900-01-01',
          cardCode: this.customer.fiscalID + 'CL',
          cardName: this.customer.firstName.toUpperCase() + ' ' + apellidos.toUpperCase(),
          defaultBillingAddress: 'FACTURACIÓN',
          defaultShippingAddress: 'FACTURACIÓN',
          firstName: this.customer.firstName.toUpperCase(),
          lastName1: this.customer.lastName1.toUpperCase(),
          lastName2: this.customer.lastName2.toUpperCase(),
          fiscalID: this.customer.fiscalID,
          selfRetainer: 'N',
          salesPersonCode: '98',
          cardType: 'CUSTOMER',
          fiscalIdType: this.customer.fiscalIdType,
          foreignType: 'CON_CLAVE',
          gender: 'NINGUNO',
          nationality: nacionalidad,
          personType: 'NATURAL',
          taxRegime: 'REGIMEN_SIMPLIFICADO',
          addresses: []
        }

        let billAddress = {
          stateCode: this.customer.addresses[0].cityCode.toString().substring(0, 2),
          stateName: '',
          cityCode: this.customer.addresses[0].cityCode,
          cityName: this.customer.addresses[0].cityName,
          addressName: 'FACTURACIÓN',
          addressType: 'BILLING',
          address: this.customer.addresses[0].address,
          landLine: this.customer.addresses[0].cellphone,
          cellphone: this.customer.addresses[0].cellphone,
          email: this.customer.addresses[0].email,
          country: 'CO',
          taxCode: ''
        }

        let shipAddress = {
          stateCode: this.customer.addresses[0].cityCode.toString().substring(0, 2),
          stateName: '',
          cityCode: this.customer.addresses[0].cityCode,
          cityName: '',
          addressName: 'FACTURACIÓN',
          addressType: 'SHIPPING',
          address: this.customer.addresses[0].address,
          landLine: this.customer.addresses[0].cellphone,
          cellphone: this.customer.addresses[0].cellphone,
          email: this.customer.addresses[0].email,
          country: 'CO',
          taxCode: ''
        }

        businesspartner.addresses.push(billAddress);
        businesspartner.addresses.push(shipAddress);

        this._customerService.createCustomer(businesspartner).subscribe(
          response => {
            if (response.estado == 0) {
              this.enviarPlaceToPay(_idCarrito);
            } else {
              //error
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    );
  }

  private enviarPlaceToPay(_id) {
    console.log(this.customer);
    //Se mapean los datos que se le enviaran a PlacetoPay
    let apellidos = '';
    apellidos += this.customer.lastName1;
    if (this.customer.lastName2 != null && this.customer.lastName2.length > 0) {
      apellidos += ' ' + this.customer.lastName2;
    }

    let buyer = {
      document: this.customer.fiscalID,
      name: this.customer.firstName,
      surname: apellidos,
      documentType: this.customer.fiscalIdType,
      email: this.customer.addresses[0].email,
      mobile: this.customer.addresses[0].cellphone,
      address: {
        street: this.customer.addresses[0].address,
        city: this.customer.addresses[0].cityName,
        country: this.customer.addresses[0].country
      }
    };
    let payment = {
      allowPartial: 'false',
      description: 'Compra matisses.co',
      reference: _id,
      amount: {
        currency: 'COP',
        total: this.carrito.totalCarrito,
        taxes: {
          kind: 'valueAddedTax',
          amount: this.carrito.totalImpuestos
        }
      }
    }

    this.datosPago = new DatosPagoPlaceToPay().newDatosPagoPlaceToPay(buyer, null, navigator.userAgent, payment, null, null, 'http://192.168.5.23:4200/resultado-transaccion/' + _id, '');

    console.log(this.datosPago);

    this._placetopayService.redirect(this.datosPago).subscribe(
      response => {
        if (response.codigo === -1) {
          this.procesandoP2P = false;
          return;
        }
        localStorage.removeItem('matisses.shoppingCart');
        window.location.href = response.respuestaPlaceToPay.processUrl;
      },
      error => {
        console.log(error);
      }
    );
  }

  public seleccionarMetodoEnvio(metodo) {
    console.log(metodo);
    this.metodoEnvioSeleccionado = metodo;
  }

  private obtenerNombreCiudad() {
    if (this.customer.addresses[0].cityName == null || this.customer.addresses[0].cityName.length <= 0) {
      for (let i = 0; i < this.ciudadesPrincipales.length; i++) {
        if (this.ciudadesPrincipales[i].code === this.customer.addresses[0].cityCode.toString()) {
          this.customer.addresses[0].cityName = this.ciudadesPrincipales[i].name;
          break;
        }
      }
      if (this.customer.addresses[0].cityName == null || this.customer.addresses[0].cityName.length <= 0) {
        for (let i = 0; i < this.otrasCiudades.length; i++) {
          if (this.otrasCiudades[i].code === this.customer.addresses[0].cityCode.toString()) {
            this.customer.addresses[0].cityName = this.otrasCiudades[i].name;
            break;
          }
        }
      }
    }
  }
}
