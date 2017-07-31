import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Customer } from '../../models/customer';
import { Item } from '../../models/item';
import { City } from '../../models/city';

import { CustomerService } from '../../services/customer.service';
import { CityService } from '../../services/city.service';

import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

declare var $: any;

@Component({
  templateUrl: 'info-pago.html',
  styleUrls: ['info-pago.component.css'],
  providers: [CustomerService, CityService]
})

export class InfoPagoComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;

  public totalItems: number = 0;
  public totalCarrito: number = 0;
  public totalEnvio: number = 0;
  public title: string;
  public number: string;
  public customer: Customer;
  public ciudadesPrincipales: Array<City>;
  public otrasCiudades: Array<City>;
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _customerService: CustomerService, private _cityService: CityService) {
    this.ciudadesPrincipales = new Array<City>();
    this.otrasCiudades = new Array<City>();
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
    this.title = 'Este es el cuerpo de informacion de pago';
    this.number = '3';
  }

  ngOnInit() {
    console.log('inicializando componente de información de pago');
    this.carrito.cargarCarrito();
    this.procesarCarrito();
    this.obtenerCiudades();
  }

  private procesarCarrito() {
    this.totalItems = 0;
    this.totalCarrito = 0;
    for (let i = 0; i < this.carrito.items.length; i++) {
      this.totalItems += this.carrito.items[i].selectedQuantity;
      this.totalCarrito += (this.carrito.items[i].price * this.carrito.items[i].selectedQuantity);
    }
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

  public buscarCliente() {
    if (this.customer.fiscalID != null && this.customer.fiscalID.length > 0) {
      this._customerService.getCustomerData(this.customer.fiscalID).subscribe(
        response => {
          this.customer = response;
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public pagar() {
    if (this.customer.cardCode == null || this.customer.cardCode.length <= 0 || this.customer.firstName == null || this.customer.firstName.length <= 0
      || this.customer.lastName1 == null || this.customer.lastName1.length <= 0) {
      console.log('Se deben llenar todos los campos obligatorios para poder proceder con el pago');
      return;
    }
    console.log('El usuario sera redireccionado a PlacetoPay');
  }
}
