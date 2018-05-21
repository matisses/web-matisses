import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../services/global';

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
import { CoordinadoraService } from '../../services/coordinadora.service';
import { ShoppingCartValidatorService } from '../../services/shopping-cart-validator.service';
import { DescuentosService } from '../../services/descuentos.service';
import { DigitoVerificacionService } from '../../services/digitoVerificacion.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';
import { CarritoComponent } from '../header/menu/carrito/carrito.component';
import { CompileAnimationStateDeclarationMetadata } from '@angular/compiler';

declare var $: any;

@Component({
  templateUrl: 'info-pago.html',
  styleUrls: ['info-pago.component.css'],
  providers: [CustomerService, CityService, ShippingMethodService, PlacetoPayService, ShoppingCartService, ItemService, CoordinadoraService,
    ShoppingCartValidatorService, DescuentosService, DigitoVerificacionService]
})

export class InfoPagoComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  public carrito: CarritoSimpleComponent;

  @ViewChild(CarritoComponent)
  public carrito1: CarritoComponent;

  public costoEnvio: number = 0;
  public totalEnvio: number = 0;
  public messageError: string;
  public messageCambio: string;
  public tiendaSeleccionada: string = 'Medellín';
  public urlReturn: string;
  public procesandoP2P: boolean = false;
  public valid: boolean = true;
  public disabled: boolean = false;
  public customer: Customer;
  public metodoEnvioSeleccionado: ShippingMethod = null;
  public datosPago: DatosPagoPlaceToPay = null;
  public ciudadesPrincipales: Array<City>;
  public otrasCiudades: Array<City>;
  public metodosEnvio: Array<ShippingMethod>;
  private viewportWidth: number = 0;
  public resumenMobileVisible: boolean = false;
  public resumenDesktopVisible: boolean = false;
  public maxlength: number;

  constructor(private _route: ActivatedRoute, private _router: Router, private _customerService: CustomerService, private _cityService: CityService,
    private _shippingMethodService: ShippingMethodService, private _placetopayService: PlacetoPayService, private _shoppingCartService: ShoppingCartService,
    private _itemService: ItemService, private _coordinadoraService: CoordinadoraService, private _shoppingCartValidatorService: ShoppingCartValidatorService,
    private _descuentosService: DescuentosService, private _digitoVerificacionService: DigitoVerificacionService) {
    this.messageError = '';
    this.urlReturn = GLOBAL.urlTransactionResult;
    this.limpiar();
    this.ciudadesPrincipales = new Array<City>();
    this.otrasCiudades = new Array<City>();
    this.metodosEnvio = new Array<ShippingMethod>();
  }

  ngOnInit() {
    this.carrito.cargarCarrito();
    this.obtenerMetodosEnvio();
    this.obtenerCiudades();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

  public obtenerCiudades() {
    this.ciudadesPrincipales = new Array<City>();
    this.otrasCiudades = new Array<City>();
    this._cityService.findPrincipalCities().subscribe(
      response => {
        this.ciudadesPrincipales = response.cities;
      },
      error => { console.error(error); }
    );
    this._cityService.findOtherCities().subscribe(
      response => {
        this.otrasCiudades = response.cities;
      },
      error => { console.error(error); }
    );
  }

  public obtenerMetodosEnvio() {
    let base = 150000;//TODO: monto base para envios gratis.
    this.metodosEnvio = new Array<ShippingMethod>();
    this._shippingMethodService.listShippingMethods().subscribe(
      response => {
        this.metodosEnvio = new Array<ShippingMethod>();
        for (let i = 0; i < response.length; i++) {
          // if(response[i].code === 3){
          //   //TODO: se debe quitar esta condición si el medio es Coordinadora
          // } else
          if (this.validarEnvioGratis()) {
            this.metodosEnvio.push(response[i]);
          } else if (((this.carrito.totalCarrito) - this.carrito.totalDescuentos) >= base && response[i].code === 1) {
            this.metodosEnvio.push(response[i]);
          } else if (((this.carrito.totalCarrito) - this.carrito.totalDescuentos) < base && response[i].code !== 1) {
            this.metodosEnvio.push(response[i]);
          }
        }
      },
      error => { console.error(error); }
    );

    // this.metodosEnvio = new Array<ShippingMethod>();
    // this._shippingMethodService.listShippingMethods().subscribe(
    //   response => {
    //     for (let i = 0; i < response.length; i++) {
    //       if (response[i].code === 3) {
    //         //TODO: se debe quitar esta condición si el medio es Coordinadora
    //       } else {
    //         this.metodosEnvio.push(response[i]);
    //       }
    //     }
    //     // this.metodosEnvio = response;
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
  }

  public buscarCliente() {
    this.disabled = false;
    this.customer.fiscalID = this.customer.fiscalID.trim();
    this.customer.cardCode = this.customer.fiscalID.trim();

    this.messageError = '';
    if (this.customer.fiscalID != null && this.customer.fiscalID.length > 0) {
      this._customerService.getCustomerData(this.customer.fiscalID).subscribe(
        response => {
          if (response.fiscalIdType == '31') {
            this.customer.fiscalID = response.fiscalID;
            this.customer.fiscalIdType = response.fiscalIdType;
            this.customer.firstName = response.contacts.firstName + ' ' + response.contacts.middleName;
            this.customer.lastName1 = response.contacts.lastName1;
            this.customer.lastName2 = response.contacts.lastName2;
            this.customer.birthDate = response.birthDate;
            this.customer.addresses[0].email = response.addresses[0].email;
            this.customer.addresses[0].cellphone = response.addresses[0].cellphone;
            this.customer.addresses[0].address = response.addresses[0].address;
            this.customer.addresses[0].cityCode = response.addresses[0].cityCode;
            this.customer.cardName = response.cardName;
            this.disabled = true;
            this.valid = false;
            return;
          }

          this.customer = response;
          this.disabled = true;
          this.consultarCostoEnvio();
        },
        error => {
          if (this.customer.fiscalIdType == '31') {
            this._digitoVerificacionService.consultarDigitoVerificacion(this.customer.fiscalID).subscribe(
              response => {
                if (response != null || response.length > 0) {
                  this.customer.fiscalID = this.customer.fiscalID + '-' + response;
                } else {
                  this.messageError = "Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.";
                }
              },
              error => { console.error(error); }
            );
          }

          let cedula = this.customer.fiscalID;
          this.customer.firstName = null;
          this.customer.lastName1 = null;
          this.customer.lastName2 = null;
          this.customer.cardName = null;
          this.customer.addresses[0].email = null;
          this.customer.addresses[0].cellphone = null;
          this.customer.addresses[0].cityCode = null;
          this.customer.addresses[0].address = null;
          this.customer.fiscalID = cedula;
          console.error(error);
        }
      );
    } else { this.limpiar(); }
  }

  public consultarCostoEnvio() {
    let datosCompra = {
      ciudadDestino: this.customer.addresses[0].cityCode,
      items: []
    };

    for (let j = 0; j < this.carrito.shoppingCart.items.length; j++) {
      datosCompra.items.push(this.carrito.shoppingCart.items[j]);
    }

    this._coordinadoraService.crearCotizacionEnvio(datosCompra).subscribe(
      response => {
        for (let i = 0; i < this.metodosEnvio.length; i++) {
          if (this.metodosEnvio[i].code === 3) {
            this.costoEnvio = response.valor;
            break;
          }
        }
        this.obtenerMetodosEnvio();
      },
      error => { console.error(error); }
    );
  }

  private validarEnvioGratis() {
    //TODO: parametrizacion de ciudades para envios gratis.
    let ciudadesEnvioGratis = [
      //Antioquia: valle de Aburra
      "Medellín05001",
      "Bello05088",
      "Itagui05360",
      "Eenvigado05266",
      "Caldas (Antioquia)05129",
      "Copacabana05212",
      "La Estrella05380",
      "Girardota05308",
      "Sabaneta05631",
      "Barbosa (Antioquia)05079",
      //Bogotá DC: area metropolitana
      "Bogotá11001",
      "Soacha25754",
      "Chía25175",
      "Zipaquirá25899",
      "Madrid25430",
      "Funza25286",
      "Cajicá25126",
      "Sibaté25740",
      "Tocancipá25817",
      "Tabio25785",
      "La Calera25377",
      "Sopó25758",
      "Cota25214",
      "Tenjo25799",
      "Mosquera (Cundinamarca)25473",
      "Gachancipá25295",
      "Bojacá25099",
      "El Rosal25260"
    ];

    for (let k = 0; k < ciudadesEnvioGratis.length; k++) {
      if (ciudadesEnvioGratis[k] == (this.customer.addresses[0].cityName + this.customer.addresses[0].cityCode)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  public pagar() {
    this.valid = true;
    this.messageError = '';
    if (this.metodoEnvioSeleccionado == null || this.metodoEnvioSeleccionado.code == 0) {
      this.messageError = 'Debes seleccionar un medio de envió.';
      return;
    }
    if (this.metodoEnvioSeleccionado.code == 2 && (this.tiendaSeleccionada == null || this.tiendaSeleccionada.length <= 0)) {
      this.messageError = 'Debes seleccionar la tienda en la que deseas recoger los artículos.';
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
      this.messageError = 'Debes llenar todos los campos obligatorios para poder proceder con el pago.';
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
            precioNuevo: false,
            items: this.carrito.shoppingCart.items
          }

          for (let i = 0; i < shoppingCart.items.length; i++) {
            if (shoppingCart.items[i].itemcode == '24400000000000000121') {
              if (this.carrito.validarItem(shoppingCart.items[i].itemcode)) {
                shoppingCart.precioNuevo = true;
              }
            }
            if (!shoppingCart.items[i].descuento || shoppingCart.items[i].descuento > 0) {
              shoppingCart.items[i].nuevoPrecio = shoppingCart.items[i].priceafterdiscount;
            } else {
              shoppingCart.items[i].nuevoPrecio = shoppingCart.items[i].priceaftervat;
            }
          }
          this._shoppingCartService.saveShoppingCart(shoppingCart).subscribe(
            response => {
              //Se guarda en el localStorage el carrito
              this.carrito.shoppingCart._id = response.shoppingCart._id;
              localStorage.setItem('matisses.shoppingCart', JSON.stringify(this.carrito.shoppingCart));
              this.validarCliente(this.carrito.shoppingCart._id);
            },
            error => { console.error(error); }
          );
        }
      },
      error => {
        console.error(error);
        this.procesandoP2P = false;
      }
    );
  }

  private validarCliente(_idCarrito) {
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
        let tipoPersona = '';
        let NombreCliente = '';
        apellidos += this.customer.lastName1;

        if (this.customer.lastName2 != null && this.customer.lastName2.length > 0) {
          apellidos += ' ' + this.customer.lastName2;
        }
        if (this.customer.nationality === 'NATIONAL') {
          nacionalidad = 'NATIONAL';
        } else {
          nacionalidad = 'FOREIGN';
        }

        if (this.customer.fiscalIdType == '31') {
          tipoPersona = 'JURIDICA';
          NombreCliente = this.customer.cardName.toUpperCase();
        } else {
          tipoPersona = 'NATURAL';
          NombreCliente = this.customer.firstName.toUpperCase() + ' ' + apellidos.toUpperCase();
        }

        let businesspartner = {
          birthDate: '1900-01-01',
          cardCode: this.customer.cardCode.trim() + 'CL',
          cardName: NombreCliente,
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
          personType: tipoPersona,
          taxRegime: 'REGIMEN_SIMPLIFICADO',
          addresses: [],
          contacts: {
            name: 'ContactoWeb',
            firstName: this.customer.firstName.toUpperCase(),
            middleName: '',
            lastName1: this.customer.lastName1.toUpperCase(),
            lastName2: this.customer.lastName2.toUpperCase(),
            address: this.customer.addresses[0].address.toUpperCase(),
            tel1: '',
            cellolar: this.customer.addresses[0].cellphone,
            eMailL: this.customer.addresses[0].email.toUpperCase()
          }
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
              this.messageError = "Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.";
            }
          },
          error => { console.error(error); }
        );
      }
    );
  }

  private enviarPlaceToPay(_id) {
    //Se valida el estado de los items como primera medida
    let datosCompraWeb = {
      idCarrito: '00000000000000000',
      items: this.carrito.shoppingCart.items
    }

    this._shoppingCartValidatorService.validate(datosCompraWeb).subscribe(
      response => {
        if (response.mensaje === 'true') {
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
              total: ((this.carrito.totalCarrito + (this.metodoEnvioSeleccionado.code === 2 ? 0 : this.costoEnvio)) - this.carrito.totalDescuentos),
              taxes: {
                kind: 'valueAddedTax',
                amount: this.carrito.totalImpuestos
              }
            }
          }

          this.datosPago = new DatosPagoPlaceToPay().newDatosPagoPlaceToPay(buyer, null, navigator.userAgent, payment, null, null, this.urlReturn + _id, '');

          this._placetopayService.redirect(this.datosPago).subscribe(
            response => {
              if (response.codigo === -1) {
                this.procesandoP2P = false;
                return;
              }
              localStorage.removeItem('matisses.shoppingCart');
              window.location.href = response.respuestaPlaceToPay.processUrl;
            },
            error => { console.error(error); }
          );
        } else {
          this.messageCambio = 'No se pudo continuar con el proceso de compra, debido a que uno o varios ítems ya no aplican descuento.';
          $('#cambioPrecio').modal('show');
        }
      }, error => { console.error(error) }
    );

    //
    //
    //
    //
    // //Se mapean los datos que se le enviaran a PlacetoPay
    // let apellidos = '';
    // apellidos += this.customer.lastName1;
    // if (this.customer.lastName2 != null && this.customer.lastName2.length > 0) {
    //   apellidos += ' ' + this.customer.lastName2;
    // }
    //
    // let buyer = {
    //   document: this.customer.fiscalID,
    //   name: this.customer.firstName,
    //   surname: apellidos,
    //   documentType: this.customer.fiscalIdType,
    //   email: this.customer.addresses[0].email,
    //   mobile: this.customer.addresses[0].cellphone,
    //   address: {
    //     street: this.customer.addresses[0].address,
    //     city: this.customer.addresses[0].cityName,
    //     country: this.customer.addresses[0].country
    //   }
    // };
    //
    // let payment = {
    //   allowPartial: 'false',
    //   description: 'Compra matisses.co',
    //   reference: _id,
    //   amount: {
    //     currency: 'COP',
    //     total: ((this.carrito.totalCarrito + (this.metodoEnvioSeleccionado.code === 2 ? 0 : this.costoEnvio)) - this.carrito.totalDescuentos),
    //     taxes: {
    //       kind: 'valueAddedTax',
    //       amount: this.carrito.totalImpuestos
    //     }
    //   }
    // }
    //
    // this.datosPago = new DatosPagoPlaceToPay().newDatosPagoPlaceToPay(buyer, null, navigator.userAgent, payment, null, null, this.urlReturn + _id, '');
    //
    // this._placetopayService.redirect(this.datosPago).subscribe(
    //   response => {
    //     if (response.codigo === -1) {
    //       this.procesandoP2P = false;
    //       return;
    //     }
    //     localStorage.removeItem('matisses.shoppingCart');
    //     window.location.href = response.respuestaPlaceToPay.processUrl;
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
  }

  public refrescarValoresCarrito() {
    this.carrito1.clickCarrito();

    for (let i = 0; this.carrito.shoppingCart.items.length; i++) {
      this._itemService.find(this.carrito.shoppingCart.items[i].shortitemcode).subscribe(
        response => {
          if (response.result[0].priceaftervat !== this.carrito.shoppingCart.items[i].priceaftervat) {
            response.result[0].selectedQuantity = this.carrito.shoppingCart.items[i].selectedQuantity;
            this.carrito.shoppingCart.items[i].selectedQuantity = 0;
            this.carrito.procesarItem(this.carrito.shoppingCart.items[i]);
            this.carrito.procesarItem(response.result[0]);
          } else {
            if (this.carrito.shoppingCart.items[i].descuento) {
              if (this.carrito.shoppingCart.items[i].descuento > 0) {
                this._descuentosService.findDiscount(this.carrito.shoppingCart.items[i].itemcode).subscribe(
                  response => {
                    if (!(response.descuentos.length > 0 && (response.descuentos[0].porcentaje === this.carrito.shoppingCart.items[i].descuento))) {
                      let item = this.carrito.shoppingCart.items[i];
                      let selectedQuantity = this.carrito.shoppingCart.items[i].selectedQuantity;
                      if (response.descuentos.length > 0 && response.descuentos[0].porcentaje !== 'undefined') {
                        this.carrito.shoppingCart.items[i].discount = response.descuentos[0].porcentaje;
                        item.descuento = response.descuentos[0].porcentaje;
                        item.priceafterdiscount = this.carrito.shoppingCart.items[i].priceaftervat + ((this.carrito.shoppingCart.items[i].priceaftervat / 100) * item.descuento);
                      } else {
                        this.carrito.shoppingCart.items[i].discount = 0;
                        item.descuento = 0;
                        item.priceafterdiscount = 0;
                      }
                      this.carrito.shoppingCart.items[i].selectedQuantity = 0;
                      this.carrito.procesarItem(this.carrito.shoppingCart.items[i]);
                      item.selectedQuantity = selectedQuantity;
                      this.carrito.procesarItem(item);
                      this.carrito.mostrarModalCarrito(false);//TODO: false no muestra modal de agreagr al cerrar cambioPrecio
                      this.procesandoP2P = false;
                    }
                  }, error => { console.error(error); }
                );
              }
            }
          }
        }, error => { console.error(error); }
      );
    }
    this._router.navigate(['www.matisses.co/resumen-carrito']);
    this.carrito.cargarCarrito();
  }

  public seleccionarMetodoEnvio(metodo) {
    this.metodoEnvioSeleccionado = metodo;
    if (metodo.code === 2) {
      this.totalEnvio = 0;
    } else {
      this.totalEnvio = this.costoEnvio;
    }
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

  public cambiarCiudad() {
    if (this.customer.addresses[0].cityCode != null || this.customer.addresses[0].cityCode != 0) {
      this.obtenerNombreCiudad();
      this.consultarCostoEnvio();
    }
  }

  public limpiar() {
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
  }

  public toggleResumen() {
    if (this.resumenMobileVisible || this.resumenDesktopVisible) {
      //ocultar mobile
      this.closeResumen();
    } else {
      //mostrar mobile/desktop
      this.openResumen();
    }
  }

  private openResumen() {
    if (this.viewportWidth <= 991) {
      //mostrar mobile
      const divs = document.getElementById("carrito1").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "315px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0.75)";
          this.resumenMobileVisible = true;
          break;
        }
      }
    } else {
      //mostrar desktop
      const divs = document.getElementById("carrito2").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "315px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0.75)";
          this.resumenDesktopVisible = true;
          break;
        }
      }
    }
    this.carrito.cargarCarrito();
  }

  public closeResumen() {
    if (this.viewportWidth <= 991) {
      //mostrar mobile
      const divs = document.getElementById("carrito1").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "0px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0)";
          this.resumenMobileVisible = false;
          break;
        }
      }
    } else {
      //mostrar desktop
      const divs = document.getElementById("carrito2").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "0px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0)";
          this.resumenDesktopVisible = false;
          break;
        }
      }
    }
  }

  public vaciarDocumento(tipoDocumento: string) {
    if (tipoDocumento === '31') {
      this.customer.fiscalID = "";
      this.maxlength = 9;
    } else {
      this.customer.fiscalID = "";
      this.customer.cardName = "";
      this.maxlength = 10;
    }
  }
}