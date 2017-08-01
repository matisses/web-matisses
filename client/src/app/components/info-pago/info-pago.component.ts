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

  public totalEnvio: number = 0;
  public customer: Customer;
  public ciudadesPrincipales: Array<City>;
  public otrasCiudades: Array<City>;
  public procesandoP2P: boolean = false;

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
  }

  ngOnInit() {
    console.log('inicializando componente de información de pago');
    this.carrito.cargarCarrito();
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
    this.procesandoP2P = true;
  }
}
