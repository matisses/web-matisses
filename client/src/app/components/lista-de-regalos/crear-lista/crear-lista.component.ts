import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Customer } from '../../../models/customer';
import { City } from '../../../models/city';

import { CustomerService } from '../../../services/customer.service';
import { CityService } from '../../../services/city.service';
import { ListaRegalosService } from '../../../services/lista-regalos.service';

//declare var jQuery: any;
declare var $: any;

@Component({
  templateUrl: 'crear-lista.html',
  styleUrls: ['crear-lista.component.css'],
  providers: [CustomerService, CityService, ListaRegalosService]
})

export class CrearListaComponent implements OnInit {
  public tipoEvento: number = 0;
  public paso: number = 1;
  private viewportWidth: number = 0;
  public mesInicio: string;
  public anoInicio: string;
  public invitados: number;
  public diaInicio: string;
  public messageError: string;
  public messageExit: string;
  public celebracion: string;
  public lugar: string;
  public tiendaContacto: string;
  public usarDatos: string;
  public idListaCreada: string;
  public nombreCreadorLista: string;
  public fechaEventoLista: string;
  public messageAgadecimiento: string;
  public mostrarDatosNovia: boolean = true;
  public mostrarDatosNovio: boolean = true;
  public notificacionInmediataMailCreador: boolean = false;
  public notificacionDiariaMailCreador: boolean = false;
  public notificacionSemanalMailCreador: boolean = false;
  public notificacionInmediataSmsCreador: boolean = false;
  public notificacionDiariaSmsCreador: boolean = false;
  public notificacionSemanalSmsCreador: boolean = false;
  public notificacionInmediataMailCocreador: boolean = false;
  public notificacionDiariaMailCocreador: boolean = false;
  public notificacionSemanalMailCocreador: boolean = false;
  public notificacionInmediataSmsCocreador: boolean = false;
  public notificacionDiariaSmsCocreador: boolean = false;
  public notificacionSemanalSmsCocreador: boolean = false;
  public checkedCreadorF: boolean = true;
  public checkedCreadorM: boolean = false;
  public checkedCocreadorF: boolean = false;
  public checkedCocreadorM: boolean = true;
  public validCreador: boolean = true;
  public validCocreador: boolean = true;
  public disabledCreador: boolean = false;
  public disabledCocreador: boolean = false;
  public validForm2: boolean = true;
  public validForm3: boolean = true;
  public validForm4: boolean = true;
  public disabledForm3: boolean = false;
  public disabledForm4: boolean = false;
  public aceptaTerminos: boolean = false;
  public existeCreador: boolean = false;
  public existeCocreador: boolean = false;
  public dayEvent: Array<number>;
  public yearEvent: Array<number>;
  public monthEvent: Array<number>;
  public ciudadesPrincipales: Array<City>;
  public otrasCiudades: Array<City>;
  public customerCreador: Customer;
  public customerCocreador: Customer;

  constructor(private _route: ActivatedRoute, private _router: Router, private _customerService: CustomerService,
    private _cityService: CityService, private _listaRegalosService: ListaRegalosService) {
    this.customerCreador = new Customer();
    this.customerCocreador = new Customer();
    this.dayEvent = new Array<number>();
    this.monthEvent = new Array<number>();
    this.yearEvent = new Array<number>();
    this.ciudadesPrincipales = new Array<City>();
    this.otrasCiudades = new Array<City>();
    this.celebracion = '';
    this.lugar = '';
    this.tiendaContacto = '';
    this.messageError = '';
    this.messageExit = '';
    this.usarDatos = 'CREADOR'
    this.messageAgadecimiento = '';
    this.notificacionInmediataMailCreador = true;
  }

  ngOnInit() {
    // $(window).scroll(function() {
    //   var scroll = $(window).scrollTop();
    //   if (scroll >= 30) {
    //     $(".contenedor-formulario").addClass("margin-top-scroll");
    //   } else {
    //     $(".contenedor-formulario").removeClass("margin-top-scroll")
    //   }
    // });

    //Bloqueo del botón ir atras, no deja al usuario ir atras.
    window.onload = function() {
      if (typeof history.pushState === "function") {
        history.pushState(null, null, null);
        window.onpopstate = function() {
          history.pushState(null, null, null);
        };
      }
    }

    //Mensaje de pereder los datos si recarga la página.
    window.onbeforeunload = function(e) {
      var e = e || window.event;
      var msg = "¿De verdad quieres dejar esta página?"
      // For IE and Firefox
      if (e) {
        e.returnValue = msg;
      }
      // For Safari / chrome
      return msg;
    };
    this.cargarAnos();
    this.obtenerCiudades();
  }

  ngAfterViewInit() {
    // this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    // if (this.viewportWidth <= 767) {
    //   this.showDatos(-1);
    // } else {
    // }
  }

  // public showDatos(option:number) {
  //   if (this.viewportWidth <= 768) {
  //     if ((option === 0 || option === 1) && !this.mostrarDatosNovia) {
  //       this.mostrarDatosNovia = true;
  //     } else {
  //       this.mostrarDatosNovia = false;
  //     }
  //     if ((option === 0 || option === 2) && !this.mostrarDatosNovio) {
  //       this.mostrarDatosNovio = true;
  //     } else {
  //       this.mostrarDatosNovio = false;
  //     }
  //   } else {
  //   }
  // }

  public seleccionarEvento(id) {
    this.tipoEvento = id;
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

  public buscarCreador() {
    this.disabledCreador = false;
    this.customerCreador.fiscalID = this.customerCreador.fiscalID.trim();
    this.limpiarCampos();

    if (this.customerCreador.fiscalID != null && this.customerCreador.fiscalID.length > 0) {
      this._customerService.getCustomerData(this.customerCreador.fiscalID).subscribe(
        response => {
          if (response.fiscalIdType == '31') {
            this.messageError = 'Tu tipo de documento no está habilitado actualmente para realizar compras en el sitio web.';
            this.validCreador = false;
            return;
          }
          if (response.gender == 'MASCULINO') {
            this.checkedCreadorF = false;
            this.checkedCreadorM = true;
          } else {
            this.checkedCreadorF = true;
            this.checkedCreadorM = false;
          }
          this.customerCreador = response;
          this.existeCreador = true;
          this.disabledCreador = true;
        },
        error => {
          this.customerCreador.fiscalIdType = '';
          this.customerCreador.firstName = '';
          this.customerCreador.lastName1 = '';
          this.customerCreador.lastName2 = '';
          this.customerCreador.addresses[0].email = '';
          this.customerCreador.addresses[0].cityCode = null;
          this.customerCreador.addresses[0].address = '';
          this.customerCreador.addresses[0].cellphone = '';
          this.existeCreador = false;
          console.error(error);
        }
      );
    } else {
      this.customerCreador = new Customer();
    }
  }

  public buscarCocreador() {
    this.disabledCocreador = false;
    this.customerCocreador.fiscalID = this.customerCocreador.fiscalID.trim();
    this.limpiarCampos();

    if (this.customerCocreador.fiscalID != null && this.customerCocreador.fiscalID.length > 0) {
      this._customerService.getCustomerData(this.customerCocreador.fiscalID).subscribe(
        response => {
          if (response.fiscalIdType == '31') {
            this.messageError = 'Tu tipo de documento no está habilitado actualmente para realizar compras en el sitio web.';
            this.validCocreador = false;
            return;
          }
          if (response.gender == 'MASCULINO') {
            this.checkedCocreadorF = false;
            this.checkedCocreadorM = true;
          } else {
            this.checkedCocreadorF = true;
            this.checkedCocreadorM = false;
          }
          this.customerCocreador = response;
          this.existeCocreador = true;
          this.disabledCocreador = true;
        },
        error => {
          this.customerCocreador.fiscalIdType = '';
          this.customerCocreador.firstName = '';
          this.customerCocreador.lastName1 = '';
          this.customerCocreador.lastName2 = '';
          this.customerCocreador.addresses[0].email = '';
          this.customerCocreador.addresses[0].cityCode = null;
          this.customerCocreador.addresses[0].address = '';
          this.customerCocreador.addresses[0].cellphone = '';
          this.existeCocreador = false;
          console.error(error);
        }
      );
    } else {
      this.customerCocreador = new Customer();
    }
  }

  public llenarDatosNovios() {
    if ((this.customerCreador.fiscalID == null || this.customerCreador.fiscalID.length <= 0
      || this.customerCreador.firstName == null || this.customerCreador.firstName.length <= 0
      || this.customerCreador.lastName1 == null || this.customerCreador.lastName1.length <= 0
      || this.customerCreador.fiscalIdType == null || this.customerCreador.fiscalIdType.length <= 0
      || this.customerCreador.addresses[0].email == null || this.customerCreador.addresses[0].email.length <= 0)
      ||
      (this.customerCocreador.fiscalID == null || this.customerCocreador.fiscalID.length <= 0
        || this.customerCocreador.firstName == null || this.customerCocreador.firstName.length <= 0
        || this.customerCocreador.lastName1 == null || this.customerCocreador.lastName1.length <= 0
        || this.customerCocreador.fiscalIdType == null || this.customerCocreador.fiscalIdType.length <= 0
        || this.customerCocreador.addresses[0].email == null || this.customerCocreador.addresses[0].email.length <= 0)
    ) {
      this.messageError = 'Debes llenar todos los campos obligatorios para poder continuar con el Paso #2.';
      this.validCreador = false;
      this.validCocreador = false;
      return;
    } else {
      this.limpiarCampos();
      if (this.customerCreador.fiscalID == this.customerCocreador.fiscalID) {
        this.messageError = 'Los novios no pueden ser el mismo.';
        this.validCocreador = true;
        this.disabledCocreador = false;
      } else {
        this.limpiarCampos();
        //pasar al siguiente paso
        if (this.paso < 4) {
          this.paso++;
        }
      }
    }
  }

  public llenarDatosEvento() {
    if ((this.anoInicio == null || this.anoInicio.length < 0) || (this.mesInicio == null || this.mesInicio.length < 0)
      || (this.diaInicio == null)) {
      this.messageError = 'Debes llenar todos los campos obligatorios para poder continuar con el Paso #3.';
      this.validForm2 = false;
    } else {
      this.limpiarCampos();
      //pasar al siguiente paso
      if (this.paso < 4) {
        this.paso++;
      }
    }
  }

  public validarDireccionEvento() {
    if ((this.customerCreador.addresses[0].cellphone == null || this.customerCreador.addresses[0].cellphone.length <= 0
      || this.customerCreador.addresses[0].address == null || this.customerCreador.addresses[0].address.length <= 0
      || this.customerCreador.addresses[0].cityCode == null || this.customerCreador.addresses[0].cityCode <= 0)
      || (this.customerCocreador.addresses[0].cellphone == null || this.customerCocreador.addresses[0].cellphone.length <= 0
        || this.customerCocreador.addresses[0].address == null || this.customerCocreador.addresses[0].address.length <= 0
        || this.customerCocreador.addresses[0].cityCode == null || this.customerCocreador.addresses[0].cityCode <= 0)) {
      this.messageError = 'Debes llenar todos los campos obligatorios para poder continuar con el Paso #4.';
      this.validForm3 = false;
    } else {
      this.limpiarCampos();
      //pasar al siguiente paso
      if (this.paso < 4) {
        this.paso++;
      }
    }
  }

  public crearLista() {
    let apellidosCreador = '';
    let apellidosCocreador = '';
    let usarDatosCreador;
    let usarDatosCocreador;
    apellidosCreador += this.customerCreador.lastName1;
    apellidosCocreador += this.customerCocreador.lastName1;
    if (this.customerCreador.lastName2 != null && this.customerCreador.lastName2.length > 0) {
      apellidosCreador += ' ' + this.customerCreador.lastName2;
    }
    if (this.customerCocreador.lastName2 != null && this.customerCocreador.lastName2.length > 0) {
      apellidosCocreador += ' ' + this.customerCocreador.lastName2;
    }
    if (this.usarDatos == 'CREADOR') {
      usarDatosCreador = true;
    } else {
      usarDatosCreador = false;
    }
    if (this.usarDatos == 'COCREADOR') {
      usarDatosCocreador = true;
    } else {
      usarDatosCocreador = false;
    }

    if (this.aceptaTerminos) {
      let listGiftDTO = {
        idLista: null,
        invitados: this.invitados,
        valorMinimoBono: 0,
        codigo: "",
        nombre: null,
        rutaImagenPerfil: null,
        rutaImagenPortada: null,
        mensajeBienvenida: null,
        mensajeAgradecimiento: this.messageAgadecimiento,
        listaPrivada: false,
        aceptaBonos: true,
        permitirEntregaPersonal: false,
        activa: true,
        fechaCreacion: null,
        formatoFechaEvento: this.anoInicio + '-' + this.mesInicio + '-' + this.diaInicio,
        celebracion: this.celebracion,
        lugar: this.lugar,
        cedulaCreador: this.customerCreador.fiscalID,
        nombreCreador: this.customerCreador.firstName.toUpperCase(),
        apellidoCreador: apellidosCreador.toUpperCase(),
        telefonoCreador: this.customerCreador.addresses[0].cellphone,
        direccionCreador: this.customerCreador.addresses[0].address.toUpperCase(),
        ciudadCreador: this.customerCreador.addresses[0].cityCode,
        correoCreador: this.customerCreador.addresses[0].email.toUpperCase(),
        notificacionInmediataMailCreador: this.notificacionInmediataMailCreador,
        notificacionInmediataSmsCreador: this.notificacionInmediataSmsCreador,
        notificacionDiariaMailCreador: this.notificacionDiariaMailCreador,
        notificacionDiariaSmsCreador: this.notificacionDiariaSmsCreador,
        notificacionSemanalMailCreador: this.notificacionSemanalMailCreador,
        notificacionSemanalSmsCreador: this.notificacionSemanalSmsCreador,
        notificacionCambioCategoriaCreador: "",
        cedulaCocreador: this.customerCocreador.fiscalID,
        nombreCocreador: this.customerCocreador.firstName.toUpperCase(),
        apellidoCocreador: apellidosCocreador.toUpperCase(),
        telefonoCocreador: this.customerCocreador.addresses[0].cellphone,
        direccionCocreador: this.customerCocreador.addresses[0].address.toUpperCase(),
        ciudadCocreador: this.customerCocreador.addresses[0].cityCode,
        correoCocreador: this.customerCocreador.addresses[0].email.toUpperCase(),
        notificacionInmediataMailCocreador: this.notificacionInmediataMailCocreador,
        notificacionInmediataSmsCocreador: this.notificacionInmediataSmsCocreador,
        notificacionDiariaMailCocreador: this.notificacionDiariaMailCocreador,
        notificacionDiariaSmsCocreador: this.notificacionDiariaSmsCocreador,
        notificacionSemanalMailCocreador: this.notificacionSemanalMailCocreador,
        notificacionSemanalSmsCocreador: this.notificacionSemanalSmsCocreador,
        notificacionCambioCategoriaCocreador: "",
        tiendaContacto: this.tiendaContacto,
        usarDatosCreador: usarDatosCreador,
        usarDatosCocreador: usarDatosCocreador,
        aceptaTerminos: this.aceptaTerminos,
        estado: {
          idEstado: null,
          nombre: null
        },
        tipoEvento: {
          idTipoEvento: this.tipoEvento,
          nombre: ""
        },
        categoria: {
          idCategoria: 0,
          valorMinimo: 0,
          nombre: ""
        },
        productos: [],
        fechaEventoUTC: ""
      }
      this._listaRegalosService.crearLista(listGiftDTO).subscribe(
        response => {
          if (response.codigo === 0) {
            this.buscarLista(response.mensaje);
            //crear como cliente SAP
            if (!this.existeCreador) {
              this.crearClienteCreador();
            }
            if (!this.existeCocreador) {
              this.crearClienteCocreador();
            }
            this._router.navigate(['/mi-lista']);
          } else {
            this.messageError = response.mensaje;
          }
        },
        error => {
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, intentelo mas tarde.';
          console.error(error);
        }
      );
    } else {
      this.messageError = "Debe aceptar los términos y condiciones.";
    }
  }

  public crearClienteCreador() {
    let sexo = '';
    let apellidos = '';
    let nacionalidad = '';
    apellidos += this.customerCreador.lastName1;
    if (this.customerCreador.lastName2 != null && this.customerCreador.lastName2.length > 0) {
      apellidos += ' ' + this.customerCreador.lastName2;
    }
    if (this.customerCreador.fiscalIdType === '22') {
      nacionalidad = 'FOREIGN';
    } else {
      nacionalidad = 'NATIONAL';
    }
    if (this.checkedCreadorF) {
      sexo = 'FEMENINO';
    } else {
      sexo = 'MASCULINO';
    }
    let businesspartner = {
      birthDate: '1900-01-01',
      cardCode: this.customerCreador.fiscalID + 'CL',
      cardName: this.customerCreador.firstName.toUpperCase() + ' ' + apellidos.toUpperCase(),
      defaultBillingAddress: 'FACTURACIÓN',
      defaultShippingAddress: 'FACTURACIÓN',
      firstName: this.customerCreador.firstName.toUpperCase(),
      lastName1: this.customerCreador.lastName1.toUpperCase(),
      lastName2: this.customerCreador.lastName2.toUpperCase(),
      fiscalID: this.customerCreador.fiscalID,
      selfRetainer: 'N',
      salesPersonCode: '98',
      cardType: 'CUSTOMER',
      fiscalIdType: this.customerCreador.fiscalIdType,
      foreignType: 'CON_CLAVE',
      gender: sexo,
      nationality: nacionalidad,
      personType: 'NATURAL',
      taxRegime: 'REGIMEN_SIMPLIFICADO',
      addresses: []
    }
    let billAddress = {
      stateCode: this.customerCreador.addresses[0].cityCode.toString().substring(0, 2),
      stateName: '',
      cityCode: this.customerCreador.addresses[0].cityCode,
      cityName: null,
      addressName: 'FACTURACIÓN',
      addressType: 'BILLING',
      address: this.customerCreador.addresses[0].address,
      landLine: this.customerCreador.addresses[0].cellphone,
      cellphone: this.customerCreador.addresses[0].cellphone,
      email: this.customerCreador.addresses[0].email.toUpperCase(),
      country: 'CO',
      taxCode: ''
    }
    let shipAddress = {
      stateCode: this.customerCreador.addresses[0].cityCode.toString().substring(0, 2),
      stateName: '',
      cityCode: this.customerCreador.addresses[0].cityCode,
      cityName: null,
      addressName: 'FACTURACIÓN',
      addressType: 'SHIPPING',
      address: this.customerCreador.addresses[0].address,
      landLine: this.customerCreador.addresses[0].cellphone,
      cellphone: this.customerCreador.addresses[0].cellphone,
      email: this.customerCreador.addresses[0].email.toUpperCase(),
      country: 'CO',
      taxCode: ''
    }
    businesspartner.addresses.push(billAddress);
    businesspartner.addresses.push(shipAddress);

    this._customerService.createCustomer(businesspartner).subscribe(
      response => {
        console.log('Creador de la lista, registrado como cliente');
      },
      error => {
        this.messageError = 'Lo sentimos. Se produjo un error inesperado, intentelo mas tarde.'
        console.error(error);
      }
    );
  }

  public crearClienteCocreador() {
    let sexo = '';
    let apellidos = '';
    let nacionalidad = '';
    apellidos += this.customerCocreador.lastName1;
    if (this.customerCocreador.lastName2 != null && this.customerCocreador.lastName2.length > 0) {
      apellidos += ' ' + this.customerCocreador.lastName2;
    }
    if (this.customerCocreador.fiscalIdType === '22') {
      nacionalidad = 'FOREIGN';
    } else {
      nacionalidad = 'NATIONAL';
    }
    if (this.checkedCocreadorF) {
      sexo = 'FEMENINO';
    } else {
      sexo = 'MASCULINO';
    }
    let businesspartner = {
      birthDate: '1900-01-01',
      cardCode: this.customerCocreador.fiscalID + 'CL',
      cardName: this.customerCocreador.firstName.toUpperCase() + ' ' + apellidos.toUpperCase(),
      defaultBillingAddress: 'FACTURACIÓN',
      defaultShippingAddress: 'FACTURACIÓN',
      firstName: this.customerCocreador.firstName.toUpperCase(),
      lastName1: this.customerCocreador.lastName1.toUpperCase(),
      lastName2: this.customerCocreador.lastName2.toUpperCase(),
      fiscalID: this.customerCocreador.fiscalID,
      selfRetainer: 'N',
      salesPersonCode: '98',
      cardType: 'CUSTOMER',
      fiscalIdType: this.customerCocreador.fiscalIdType,
      foreignType: 'CON_CLAVE',
      gender: sexo,
      nationality: nacionalidad,
      personType: 'NATURAL',
      taxRegime: 'REGIMEN_SIMPLIFICADO',
      addresses: []
    }
    let billAddress = {
      stateCode: this.customerCocreador.addresses[0].cityCode.toString().substring(0, 2),
      stateName: '',
      cityCode: this.customerCocreador.addresses[0].cityCode,
      cityName: null,
      addressName: 'FACTURACIÓN',
      addressType: 'BILLING',
      address: this.customerCocreador.addresses[0].address,
      landLine: this.customerCocreador.addresses[0].cellphone,
      cellphone: this.customerCocreador.addresses[0].cellphone,
      email: this.customerCocreador.addresses[0].email.toUpperCase(),
      country: 'CO',
      taxCode: ''
    }
    let shipAddress = {
      stateCode: this.customerCocreador.addresses[0].cityCode.toString().substring(0, 2),
      stateName: '',
      cityCode: this.customerCocreador.addresses[0].cityCode,
      cityName: null,
      addressName: 'FACTURACIÓN',
      addressType: 'SHIPPING',
      address: this.customerCocreador.addresses[0].address,
      landLine: this.customerCocreador.addresses[0].cellphone,
      cellphone: this.customerCocreador.addresses[0].cellphone,
      email: this.customerCocreador.addresses[0].email.toUpperCase(),
      country: 'CO',
      taxCode: ''
    }
    businesspartner.addresses.push(billAddress);
    businesspartner.addresses.push(shipAddress);

    this._customerService.createCustomer(businesspartner).subscribe(
      response => {
        console.log('Cocreador de la lista, registrado como cliente');
      },
      error => {
        this.messageError = 'Lo sentimos. Se produjo un error inesperado, intentelo mas tarde.'
        console.error(error);
      }
    );
  }

  public obtenerSiguientePaso() {
    switch (this.paso) {
      case 1:
        this.llenarDatosNovios();
        break;
      case 2:
        this.llenarDatosEvento();
        break;
      case 3:
        this.validarDireccionEvento();
        break;
      case 4:
        this.crearLista();
        break;
    }
  }

  public obtenerPasoAnterior() {
    if (this.paso < 5) {
      this.paso--;
    }
    this.limpiarCampos();
  }

  public limpiarCampos() {
    this.messageError = '';
    this.messageExit = '';
    this.validForm2 = true;
    this.validForm3 = true;
    this.validForm4 = true;
    this.validCreador = true;
    this.validCocreador = true;
  }

  public cargarDias(mes: string, ano: number) {
    this.dayEvent = new Array<number>();
    switch (mes) {
      case '01':  // Enero
      case '03':  // Marzo
      case '05':  // Mayo
      case '07':  // Julio
      case '08':  // Agosto
      case '10':  // Octubre
      case '12': // Diciembre
        for (let i = 1; i <= 31; i++) {
          this.dayEvent.push(i);
        }
        break;
      case '04':  // Abril
      case '06':  // Junio
      case '09':  // Septiembre
      case '11': // Noviembre
        for (let i = 1; i <= 30; i++) {
          this.dayEvent.push(i);
        }
        break;
      case '02':  // Febrero
        if (((ano % 100 == 0) && (ano % 400 == 0) || (ano % 100 != 0) && (ano % 4 == 0))) {
          for (let i = 1; i <= 29; i++) {
            this.dayEvent.push(i);
          }
        } else {
          for (let i = 1; i <= 28; i++) {
            this.dayEvent.push(i);
          }
        }
        break;
    }
  }

  public cargarAnos() {
    var date = new Date();
    var year = date.getFullYear();
    this.yearEvent = new Array<number>();
    for (let i = year; i <= year + 1; i++) {
      this.yearEvent.push(i);
    }
  }

  public buscarLista(codigo: string) {
    this.messageError = '';
    //Asignar datos para enviarlos a WS
    let consultaDTO = {
      nombre: null,
      apellido: null,
      codigo: codigo
    }
    this._listaRegalosService.consultarLista(consultaDTO).subscribe(
      response => {
        if (response.length > 0) {
          this.idListaCreada = response[0].idLista;
          this.nombreCreadorLista = response[0].nombreCreador.toLowerCase() + ' ' + response[0].apellidoCreador.toLowerCase() + ' & ' + response[0].nombreCocreador.toLowerCase() + ' ' + response[0].apellidoCocreador.toLowerCase();
          this.fechaEventoLista = response[0].formatoFechaEvento;
        }
      },
      error => {
        console.error(error);
      }
    );
    localStorage.setItem('id-lista', this.idListaCreada);
    localStorage.setItem('username-lista', this.nombreCreadorLista);
    localStorage.setItem('codigo-lista', codigo);
    localStorage.setItem('fecha-evento', this.fechaEventoLista);
  }
}
