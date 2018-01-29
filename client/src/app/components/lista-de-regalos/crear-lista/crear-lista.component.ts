import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Customer } from '../../../models/customer';
import { City } from '../../../models/city';

import { CustomerService } from '../../../services/customer.service';
import { CityService } from '../../../services/city.service';
import { ListGiftService } from '../../../services/listGift.service';

//declare var jQuery: any;
declare var $: any;

@Component({
  templateUrl: 'crear-lista.html',
  styleUrls: ['crear-lista.component.css'],
  providers: [CustomerService, CityService, ListGiftService]
})

export class CrearListaComponent implements OnInit {
  public tipoEvento: number = 0;
  public paso: number = 1;
  public mesInicio: number;
  public anoInicio: number;
  public invitados: number;
  public diaInicio: string;
  public messageError: string;
  public messageExit: string;
  public celebracion: string;
  public lugar: string;
  public tiendaContacto: string;
  public link: string;
  public notificacionInmediataMailCreador: boolean;
  public notificacionDiariaMailCreador: boolean;
  public notificacionSemanalMailCreador: boolean;
  public notificacionInmediataSmsCreador: boolean;
  public notificacionDiariaSmsCreador: boolean;
  public notificacionSemanalSmsCreador: boolean;
  public notificacionInmediataMailCocreador: boolean;
  public notificacionDiariaMailCocreador: boolean;
  public notificacionSemanalMailCocreador: boolean;
  public notificacionInmediataSmsCocreador: boolean;
  public notificacionDiariaSmsCocreador: boolean;
  public notificacionSemanalSmsCocreador: boolean;
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
  public usarDatosCreador: boolean = true;
  public usarDatosCocreador: boolean = false;
  public aceptaTerminos: boolean = false;
  public dayEvent: Array<number>;
  public yearEvent: Array<number>;
  public monthEvent: Array<number>;
  public ciudadesPrincipales: Array<City>;
  public otrasCiudades: Array<City>;
  public customerCreador: Customer;
  public customerCocreador: Customer;

  constructor(private _route: ActivatedRoute, private _router: Router, private _customerService: CustomerService,
    private _cityService: CityService, private _listGiftService: ListGiftService) {
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
    this.link = '';
    this.messageError = '';
    this.messageExit = '';
  }

  ngOnInit() {
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 30) {
        $(".contenedor-formulario").addClass("margin-top-scroll");
      } else {
        $(".contenedor-formulario").removeClass("margin-top-scroll")
      }
    });

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
  }

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
          this.disabledCreador = true;
        },
        error => {
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
          this.disabledCocreador = true;
        },
        error => {
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
        //TODO: pasar al siguiente paso
        if (this.paso < 4) {
          this.paso++;
        }
      }
    }
  }

  public llenarDatosEvento() {
    if ((this.anoInicio == null || this.anoInicio <= 0) || (this.mesInicio == null || this.mesInicio <= 0)
      || (this.diaInicio == null)) {
      this.messageError = 'Debes llenar todos los campos obligatorios para poder continuar con el Paso #3.';
      this.validForm2 = false;
    } else {
      this.limpiarCampos();
      //TODO: pasar al siguiente paso
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
      //TODO: pasar al siguiente paso
      if (this.paso < 4) {
        this.paso++;
      }
    }
  }

  public crearLista() {
    if (this.aceptaTerminos) {
      let listGift = {
        idLista: null,
        invitados: this.invitados,
        valorMinimoBono: 0,
        codigo: "",
        nombre: null,
        rutaImagenPerfil: null,
        rutaImagenPortada: null,
        mensajeBienvenida: null,
        mensajeAgradecimiento: "",
        listaPrivada: false,
        aceptaBonos: true,
        permitirEntregaPersonal: false,
        activa: true,
        fechaCreacion: null,
        fechaEvento: this.anoInicio + '-' + this.mesInicio + '-' + this.diaInicio,
        celebracion: this.celebracion,
        lugar: this.lugar,
        cedulaCreador: this.customerCreador.fiscalID,
        nombreCreador: this.customerCreador.firstName.toUpperCase(),
        apellidoCreador: this.customerCreador.lastName1.toUpperCase() + ' ' + this.customerCreador.lastName2.toUpperCase(),
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
        apellidoCocreador: this.customerCocreador.lastName1.toUpperCase() + ' ' + this.customerCocreador.lastName2.toUpperCase(),
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
        usarDatosCreador: true,
        usarDatosCocreador: false,
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
      this._listGiftService.createListaRegalo(listGift).subscribe(
        response => {
          this.messageExit = 'Creación de lista de regalo exitosa.';
          this.link = '[/mi-lista]';
        },
        error => {
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, intentelo mas tarde.';
          console.error(error);
        }
      );
    } else {
      this.messageError = "Debe aceptar los terminos y condiciones.";
    }
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
    this.yearEvent = new Array<number>();
    for (let i = 2018; i <= 2024; i++) {
      this.yearEvent.push(i);
    }
  }
}
