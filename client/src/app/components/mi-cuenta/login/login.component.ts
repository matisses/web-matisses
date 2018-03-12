import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SessionUsuarioService } from '../../../services/session-usuario.service';
import { JWTService } from '../../../services/jwt.service';

import { Customer } from '../../../models/customer';
import { City } from '../../../models/city';

import { CustomerService } from '../../../services/customer.service';
import { CityService } from '../../../services/city.service';
//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'login.html',
  styleUrls: ['login.component.css'],
    providers: [SessionUsuarioService, JWTService,CustomerService, CityService]
})


export class LoginComponent implements OnInit {
  public title: string;

  public nombreUsuario: string;
  public password: string;
  public token: string;
  public nombreSession: string;
  public idUsuario: string;
  public cambioContrasena: string = 'no';
  public messageError: string;
  public valid: boolean = true;
  public customer: Customer;
  public validCustomer: boolean = true;
  public disabledCustomer: boolean = false;
  public existeCustomer: boolean = false;
  public checkedCustomerF: boolean= false;
  public checkedCustomerM: boolean= false;
  public ciudadesPrincipales: Array<City>;
  public otrasCiudades: Array<City>;
  public aceptaTerminos: boolean=false;
  public suscripcionNotificaciones: boolean=false;
  public claveNueva: string;
  public claveConfirmacion: string;
  public successMessage:string;


  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: SessionUsuarioService, private _jwt: JWTService,  private _customerService: CustomerService,
    private _cityService: CityService) {
    this.title = 'Este es el cuerpo de login';
    this.customer = new Customer();
    this.ciudadesPrincipales = new Array<City>();
    this.otrasCiudades = new Array<City>();
  }

  ngOnInit() {

      this.obtenerCiudades();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    })

  }

  public modalRecuperarPassword () {
    $('#forgotPassword').modal('show');
  }

  public login() {

    this.valid = true;
    this.messageError = '';
    if (this.nombreUsuario == null || this.nombreUsuario.length <= 0) {
      this.messageError = 'Ingresa tu dirección de correo principal.';
      return;
    }
    if (this.password == null || this.password.length <= 0) {
      this.messageError = 'Debes ingresar tu clave.';
      return;
    }
    let usuarioDTO = {
      nombreUsuario: this.nombreUsuario,
      password: this.password
    }
    this._userService.login(usuarioDTO).subscribe(
      response => {
        if (response.codigo == '-1') {
          this.messageError = "Error de sesión, datos inválidos.";
          return;
        }
        this.token = response.token;
        this.idUsuario = response.usuarioId;
        this.nombreSession = response.nombre;
        if (response.esNuevo) {
          this.cambioContrasena = 'si';
        }
        this._jwt.validateToken(this.token).subscribe(
          response => {
            ('token '+this.token);
              console.log(response);
          }, error => {
            console.error(error);
            localStorage.removeItem('matisses.lista-token');
          }
        );
        localStorage.setItem('matisses.session-token', this.token);
        localStorage.setItem('username', this.nombreSession);
        localStorage.setItem('usuario-id', this.idUsuario);
        localStorage.setItem('cambio-clave', this.cambioContrasena);


        this._router.navigate(['/mi-cuenta']);
      },
      error => {
        this.messageError = "Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.";
        console.error(error);
      }
    );
  }

  public buscarCliente() {
    this.disabledCustomer = false;
    this.customer.fiscalID = this.customer.fiscalID.trim();
    this.limpiarCampos();

    if (this.customer.fiscalID != null && this.customer.fiscalID.length > 0) {
      this._customerService.getCustomerData(this.customer.fiscalID).subscribe(
        response => {
          if (response.fiscalIdType == '31') {
            this.messageError = 'Tu tipo de documento no está habilitado actualmente para realizar compras en el sitio web.';
            this.validCustomer = false;
            return;
          }
          if (response.gender == 'MASCULINO') {
            this.checkedCustomerF = false;
            this.checkedCustomerM = true;
          } else {
            this.checkedCustomerF = true;
            this.checkedCustomerM = false;
          }
          this.customer = response;
          this.existeCustomer = true;
          this.disabledCustomer = true;
        },
        error => {
          this.customer.fiscalIdType = '';
          this.customer.firstName = '';
          this.customer.lastName1 = '';
          this.customer.lastName2 = '';
          this.customer.addresses[0].email = '';
          this.customer.addresses[0].cityCode = null;
          this.customer.addresses[0].address = '';
          this.customer.addresses[0].cellphone = '';
          this.existeCustomer = false;
          console.error(error);
        }
      );
    } else {
      this.customer = new Customer();
    }
  }

  public limpiarCampos() {
    this.messageError = '';
    this.validCustomer = true;

  }

  public obtenerCiudades() {
    this.ciudadesPrincipales = new Array<City>();
    this.otrasCiudades = new Array<City>();
    this._cityService.findPrincipalCities().subscribe(
      response => {
        this.ciudadesPrincipales = response.cities;
      },
      error => {
        console.error(error);
      }
    );
    this._cityService.findOtherCities().subscribe(
      response => {
        this.otrasCiudades = response.cities;
      },
      error => {
        console.error(error);
      }
    );
  }

  public crearCliente() {
    let sexo = '';
    let apellidos = '';
    let nacionalidad = '';
    apellidos += this.customer.lastName1;
    if (this.customer.lastName2 != null && this.customer.lastName2.length > 0) {
      apellidos += ' ' + this.customer.lastName2;
    }

    if (this.customer.fiscalIdType === '22') {
      nacionalidad = 'FOREIGN';
    } else {
      nacionalidad = 'NATIONAL';
    }

    if (this.checkedCustomerF) {
      sexo = 'FEMENINO';
    } else {
      sexo = 'MASCULINO';
    }

    let businesspartner = {
      birthDate:this.customer.birthDate,
      cardCode: this.customer.fiscalID.trim() + 'CL',
      cardName: this.customer.firstName.toUpperCase() + ' ' + apellidos.toUpperCase(),
      defaultBillingAddress: 'FACTURACIÓN',
      defaultShippingAddress: 'FACTURACIÓN',
      firstName: this.customer.firstName.toUpperCase(),
      lastName1: this.customer.lastName1.toUpperCase(),
      lastName2: this.customer.lastName2.toUpperCase(),
      fiscalID: this.customer.fiscalID.trim(),
      selfRetainer: 'N',
      salesPersonCode: '98',
      cardType: 'CUSTOMER',
      fiscalIdType: this.customer.fiscalIdType,
      foreignType: 'CON_CLAVE',
      gender: sexo,
      nationality: nacionalidad,
      personType: 'NATURAL',
      taxRegime: 'REGIMEN_SIMPLIFICADO',
      addresses: []
    }
    let billAddress = {
      stateCode: this.customer.addresses[0].cityCode.toString().substring(0, 2),
      stateName: '',
      cityCode: this.customer.addresses[0].cityCode,
      cityName: null,
      addressName: 'FACTURACIÓN',
      addressType: 'BILLING',
      address: this.customer.addresses[0].address,
      landLine: this.customer.addresses[0].cellphone,
      cellphone: this.customer.addresses[0].cellphone,
      email: this.customer.addresses[0].email.toUpperCase(),
      country: 'CO',
      taxCode: ''
    }
    let shipAddress = {
      stateCode: this.customer.addresses[0].cityCode.toString().substring(0, 2),
      stateName: '',
      cityCode: this.customer.addresses[0].cityCode,
      cityName: null,
      addressName: 'FACTURACIÓN',
      addressType: 'SHIPPING',
      address: this.customer.addresses[0].address,
      landLine: this.customer.addresses[0].cellphone,
      cellphone: this.customer.addresses[0].cellphone,
      email: this.customer.addresses[0].email.toUpperCase(),
      country: 'CO',
      taxCode: ''
    }
    businesspartner.addresses.push(billAddress);
    businesspartner.addresses.push(shipAddress);

    this._customerService.createCustomer(businesspartner).subscribe(
      response => {

      },
      error => {
        this.messageError = 'Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.'
        console.error(error);
      }
    );
  }



  public registrar() {
    this.messageError='';

    if (this.claveNueva != this.claveConfirmacion) {
      
      this.messageError = 'Ambas contraseñas deben ser iguales.';
      this.successMessage = '';
      $('#messageUser').modal('show');
      return;
    }



    if (this.customer.fiscalID == null || this.customer.fiscalID.length <= 0
      || this.customer.firstName == null || this.customer.firstName.length <= 0
      || this.customer.lastName1 == null || this.customer.lastName1.length <= 0
      || this.customer.fiscalIdType == null || this.customer.fiscalIdType.length <= 0
      || this.customer.addresses[0].address == null || this.customer.addresses[0].address.length <= 0
      || this.customer.addresses[0].cellphone == null || this.customer.addresses[0].cellphone.length <= 0
      || this.customer.addresses[0].cityCode == null || this.customer.addresses[0].cityCode == 0
      || this.customer.addresses[0].email == null || this.customer.addresses[0].email.length <= 0
      || this.claveNueva == null || this.claveNueva==''
      || this.claveConfirmacion == null || this.claveConfirmacion=='') {
      this.messageError = 'Debes llenar todos los campos obligatorios para poder proceder con el pago.';
      this.valid = false;
      $('#messageUser').modal('show');
      return;
    }

    //Validar si el usuario ya existe
    if (this.aceptaTerminos) {

      this._userService.validarUsuario(this.customer.addresses[0].email,this.customer.fiscalID).subscribe(
        response => {

          if (response.estado === 0) {

            this.successMessage=''
            this.messageError='Su correo ya se encuentra registrado en nuestro sitio web';

            $('#messageUser').modal('show');
            return;
          } else {

            this.messageError ='';
          }
        },
        error => {
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.';
          console.error(error);
        }
      );

    }
    else{
      this.messageError = "Debe aceptar los términos y condiciones.";
      $('#messageUser').modal('show');
      return;
    }
    if (!this.existeCustomer) {

      this.crearCliente();
    }
    if (this.aceptaTerminos) {

      let usuarioDTO = {
        nombreUsuario:this.customer.addresses[0].email.toUpperCase(),
        nombre: this.customer.firstName+' '+this.customer.lastName1,
        password:this.claveNueva,
        documento: this.customer.fiscalID,
        aceptaTerminos: this.aceptaTerminos,
        esNuevo:true,
        suscripcionNotificaciones: this.suscripcionNotificaciones

      }

      this._userService.createUser(usuarioDTO).subscribe(
        response => {
          if (response.codigo === 0) {
            this.messageError='';
            this.successMessage= response.mensaje;
            $('#messageUser').modal('show');
          } else {
            this.messageError = response.mensaje;
          }
        },
        error => {
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.';
          console.error(error);
        }
      );
    } else {
      this.messageError = "Debe aceptar los términos y condiciones.";
    }
  }


}
