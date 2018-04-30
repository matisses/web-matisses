import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SessionUsuarioService } from '../../../services/session-usuario.service';
import { JWTService } from '../../../services/jwt.service';
import { DigitoVerificacionService } from '../../../services/digitoVerificacion.service'

import { Customer } from '../../../models/customer';
import { City } from '../../../models/city';

import { CustomerService } from '../../../services/customer.service';
import { CityService } from '../../../services/city.service';
//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'login.html',
  styleUrls: ['login.component.css'],
  providers: [SessionUsuarioService, JWTService, CustomerService, CityService, DigitoVerificacionService]
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
  public checkedCustomerF: boolean = false;
  public checkedCustomerM: boolean = false;
  public ciudadesPrincipales: Array<City>;
  public otrasCiudades: Array<City>;
  public aceptaTerminos: boolean = false;
  public suscripcionNotificaciones: boolean = false;
  public claveNueva: string;
  public claveConfirmacion: string;
  public successMessage: string;
  public recuperarEmail: string;
  public updateMessage: string;
  public documentCustomer: string;
  public celularOriginal: string;
  public correoOriginal: string;
  public direccionOriginal: string;
  public fechaOriginal: Date;
  public customerEdit: any;
  public registroDecorador: string = null;
  public registroPlanificador: string = null;
  public fileUpload: any;
  public fileUploadRut: any;
  public fileUploadCc: any;
  public fileUploadCert: any;
  public fileUploadTp: any;
  public decorador: boolean = false;
  public planificador: boolean = false;
  public digitoVerificacion: number;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: SessionUsuarioService, private _jwt: JWTService,
    private _customerService: CustomerService, private _cityService: CityService, private _digitoVerificacionService: DigitoVerificacionService) {
    this.title = 'Este es el cuerpo de login';
    this.customer = new Customer();
    this.ciudadesPrincipales = new Array<City>();
    this.otrasCiudades = new Array<City>();
    this.fileUploadRut = null;
    this.inicializarCliente();
  }

  ngOnInit() {
    // localStorage.removeItem('decorator_register');
    // localStorage.removeItem('wedding_register');
    this.registroDecorador = localStorage.getItem('decorator_register');
    this.registroPlanificador = localStorage.getItem('wedding_register');
    this.obtenerCiudades();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    })

  }

  public modalRecuperarPassword() {
    this.updateMessage = '';
    $('#forgotPassword').modal('show');
  }

  public login() {
    this.valid = true;
    this.messageError = '';
    if (this.nombreUsuario == null || this.nombreUsuario.length <= 0) {
      this.messageError = 'Ingresa tu dirección de correo principal.';
      $('#messageUser').modal('show');
      return;
    }

    if (this.password == null || this.password.length <= 0) {
      this.messageError = 'Debes ingresar tu clave.';
      $('#messageUser').modal('show');
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
          $('#messageUser').modal('show');
          return;
        }

        this.token = response.token;
        this.idUsuario = response.usuarioId;
        this.nombreSession = response.nombre;
        this.documentCustomer = response.documento;
        this.nombreUsuario = response.nombreUsuario;

        if (response.esDecorador != null) {
          this.decorador = response.esDecorador;
        }

        if (response.esPlanificador != null) {
          this.planificador = response.esPlanificador;
        }

        if (response.esNuevo) {
          this.cambioContrasena = 'si';
        }

        this._jwt.validateToken(this.token).subscribe(
          response => {
          }, error => {
            console.error(error);
            localStorage.removeItem('matisses.lista-token');
          }
        );
        localStorage.setItem('matisses.session-token', this.token);
        localStorage.setItem('username', this.nombreSession);
        localStorage.setItem('usuario-id', this.idUsuario);
        localStorage.setItem('cambio-clave', this.cambioContrasena);
        localStorage.setItem('doc-customer', this.documentCustomer);
        localStorage.setItem('nombre-usuario', this.nombreUsuario);
        localStorage.setItem('usuario-decorador', this.decorador.toString());
        localStorage.setItem('usuario-planificador', this.planificador.toString());

        this._router.navigate(['/mi-cuenta']);
      },
      error => {
        this.messageError = "Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.";
        $('#messageUser').modal('show');
        console.error(error);
      }
    );
  }

  public buscarCliente() {
    this.disabledCustomer = false;
    this.customer.fiscalID = this.customer.fiscalID.trim();
    this.customer.cardCode = this.customer.fiscalID.trim();
    this.limpiarCampos();

    if (this.customer.fiscalID != null && this.customer.fiscalID.length > 0) {
      this._customerService.getCustomerData(this.customer.fiscalID).subscribe(
        response => {
          if (response.fiscalIdType == '31') {
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
            this.existeCustomer = true;
            this.disabledCustomer = true;
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
          this.correoOriginal = this.customer.addresses[0].email;
          this.direccionOriginal = this.customer.addresses[0].address;
          this.celularOriginal = this.customer.addresses[0].cellphone;
          this.fechaOriginal = this.customer.birthDate;
          this.existeCustomer = true;
          this.disabledCustomer = true;
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
          this.customer.firstName = '';
          this.customer.lastName1 = '';
          this.customer.lastName2 = '';
          this.customer.cardName = '';
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
      error => { console.error(error); }
    );
    this._cityService.findOtherCities().subscribe(
      response => {
        this.otrasCiudades = response.cities;
      },
      error => { console.error(error); }
    );
  }

  public crearCliente() {
    let sexo = '';
    let apellidos = '';
    let nacionalidad = '';
    let documento = '';
    let tipoPersona = '';
    let NombreCliente = '';
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

    if (this.customer.fiscalIdType == "31") {
      tipoPersona = 'JURIDICA';
      NombreCliente = this.customer.cardName;
    } else {
      tipoPersona = 'NATURAL';
      NombreCliente = this.customer.firstName.toUpperCase() + ' ' + apellidos.toUpperCase();
    }

    let businesspartner = {
      birthDate: this.customer.birthDate,
      cardCode: this.customer.cardCode.trim() + 'CL',
      cardName: NombreCliente,
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
    this.messageError = '';

    if (this.claveNueva != this.claveConfirmacion) {
      this.messageError = 'Ambas contraseñas deben ser iguales.';
      this.successMessage = '';
      $('#messageUser').modal('show');
      return;
    }

    let desde = String(this.customer.birthDate).split('-');
    let fechaDesde = desde[2] + '-' + desde[1] + '-';
    let myDate = new Date();
    let fechaFormulario = new Date(this.customer.birthDate.toString());

    if (fechaFormulario.toString() == 'Invalid Date') {
      this.messageError = 'Fecha inválida, ingrese una fecha correcta';
      this.successMessage = '';
      $('#messageUser').modal('show');
      return;
    }
    if (fechaFormulario > myDate) {
      this.messageError = 'La fecha de nacimiento es superior a la fecha actual.';
      this.valid = false;
      $('#messageUser').modal('show');
      return;
    }

    if (this.registroDecorador != null || this.registroPlanificador != null) {
      if (this.fileUploadRut == null || this.fileUploadRut.length <= 0
        || this.fileUploadCc == null || this.fileUploadCc.length <= 0
        || this.fileUploadCert == null || this.fileUploadCert.length <= 0
        || this.fileUploadTp == null || this.fileUploadTp.length <= 0) {

        this.messageError = 'Debes adjuntar los documentos solicitados.';
        this.valid = false;
        $('#messageUser').modal('show');
        return;
      }
    }

    if (this.customer.fiscalID == null || this.customer.fiscalID.length <= 0
      || this.customer.firstName == null || this.customer.firstName.length <= 0
      || this.customer.lastName1 == null || this.customer.lastName1.length <= 0
      || this.customer.fiscalIdType == null || this.customer.fiscalIdType.length <= 0
      || this.customer.addresses[0].address == null || this.customer.addresses[0].address.length <= 0
      || this.customer.addresses[0].cellphone == null || this.customer.addresses[0].cellphone.length <= 0
      || this.customer.addresses[0].cityCode == null || this.customer.addresses[0].cityCode == 0
      || this.customer.addresses[0].email == null || this.customer.addresses[0].email.length <= 0
      || this.claveNueva == null || this.claveNueva == ''
      || this.claveConfirmacion == null || this.claveConfirmacion == '') {
      this.messageError = 'Debes llenar todos los campos obligatorios para poder proceder con el pago.';
      this.valid = false;
      $('#messageUser').modal('show');
      return;
    }

    //Validar si el usuario ya existe
    if (!this.aceptaTerminos) {
      this.messageError = "Debe aceptar los términos y condiciones.";
      $('#messageUser').modal('show');
      return;
    }

    if (!this.existeCustomer) {
      this.crearCliente();
    }
    else {
      this._userService.cargarcliente(this.correoOriginal).subscribe(
        response => {
          this.customerEdit = response;

          if (this.customer.addresses[0].email != this.correoOriginal ||
            this.customer.addresses[0].address != this.direccionOriginal ||
            this.customer.addresses[0].cellphone != this.celularOriginal ||
            this.customer.birthDate != this.fechaOriginal) {
            this.customerEdit.U_FechaNacimiento = this.customer.birthDate;
            this.customerEdit.BPAddresses.BPAddress[0].County = this.customer.addresses[0].email;
            this.customerEdit.BPAddresses.BPAddress[0].BuildingFloorRoom = this.customer.addresses[0].cellphone;
            this.customerEdit.BPAddresses.BPAddress[0].Street = this.customer.addresses[0].address;

            this._userService.editarCliente(this.customerEdit).subscribe(
              response => {
                if (response.estado == 0) {
                  this.messageError = 'Tu usuario se editó exitosamente.';
                  $('#messageUser').modal('show');
                  return;
                }
              },
              error => { console.error(error); }
            );
          }
        },
        error => { console.error(error); }
      );
    }

    if (this.aceptaTerminos) {
      this._userService.validarUsuario(this.customer.addresses[0].email, this.customer.fiscalID).subscribe(
        response => {
          if (response.estado === 0) {
            this.successMessage = ''
            this.messageError = 'Su correo ya se encuentra registrado en nuestro sitio web.';

            $('#messageUser').modal('show');
            return;
          } else {
            this.messageError = '';
          }
        },
        error => {
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.';
          console.error(error);
        }
      );

      let esDecorador = false;
      let esPlanificador = false;

      if (this.registroDecorador != null) {
        esDecorador = true;
      }

      if (this.registroPlanificador != null) {
        esPlanificador = true;
      }

      let usuarioDTO = {
        nombreUsuario: this.customer.addresses[0].email.toUpperCase(),
        nombre: this.customer.firstName + ' ' + this.customer.lastName1,
        password: this.claveNueva,
        documento: this.customer.fiscalID,
        aceptaTerminos: this.aceptaTerminos,
        esNuevo: true,
        suscripcionNotificaciones: this.suscripcionNotificaciones,
        esDecorador: esDecorador,
        esPlanificador: esPlanificador
      }

      this._userService.createUser(usuarioDTO).subscribe(
        response => {
          if (response.estado == '0') {
            this.messageError = '';
            this.successMessage = 'Tu usuario se creó exitosamente.';
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

  public recuperar() {
    if (this.recuperarEmail == null || this.recuperarEmail == '') {
      this.updateMessage = 'Debes ingresar un mail.';
    }
    else {
      this._userService.recuperarClave(this.recuperarEmail).subscribe(
        response => {
          if (response.estado === 0) {
            this.updateMessage = response.mensaje;
            $('#forgotPassword').modal('show');
          } else {
            this.messageError = response.mensaje;
          }
        },
        error => {
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.';
          console.error(error);
        }
      );
    }
  }

  public inicializarCliente() {
    this.customerEdit = {
      'CardCode': '',
      'CardName': '',
      'CardType': '',
      'GroupCode': '',
      'Address': '',
      "ZipCode": null,
      'MailAddress': '',
      'MailZipCode': null,
      'Phone1': '',
      'Phone2': null,
      'Fax': null,
      'ContactPerson': null,
      'Notes': null,
      'PayTermsGrpCode': -1,
      'CreditLimit': 0,
      'MaxCommitment': 0,
      'DiscountPercent': 0,
      'VatLiable': '',
      'FederalTaxID': '',
      'DeductibleAtSource': '',
      'DeductionPercent': 0,
      'DeductionValidUntil': null,
      'PriceListNum': 1,
      'IntrestRatePercent': 0,
      'CommissionPercent': 0,
      'CommissionGroupCode': 0,
      'FreeText': null,
      'SalesPersonCode': 0,
      'Currency': 'COP',
      'RateDiffAccount': null,
      'Cellular': '',
      'AvarageLate': null,
      'City': '',
      'County': '',
      "Country": 'CO',
      'MailCity': '',
      'MailCounty': '',
      'MailCountry': 'CO',
      'EmailAddress': '',
      "Picture": null,
      "DefaultAccount": null,
      "DefaultBranch": null,
      "DefaultBankCode": "-1",
      "AdditionalID": null,
      "Pager": null,
      "FatherCard": null,
      "CardForeignName": "MARIA ANGELICA FLORES GIL",
      "FatherType": "cPayments_sum",
      "DeductionOffice": null,
      "ExportCode": null,
      "MinIntrest": 0,
      "CurrentAccountBalance": -779760,
      "OpenDeliveryNotesBalance": 0,
      "OpenOrdersBalance": 0,
      "VatGroup": null,
      "ShippingType": null,
      "Password": null,
      "Indicator": null,
      "IBAN": null,
      "CreditCardCode": -1,
      "CreditCardNum": null,
      "CreditCardExpiration": null,
      "DebitorAccount": "13050501",
      "OpenOpportunities": null,
      "Valid": "tNO",
      "ValidFrom": null,
      "ValidTo": null,
      "ValidRemarks": null,
      "Frozen": "tNO",
      "FrozenFrom": null,
      "FrozenTo": null,
      "FrozenRemarks": null,
      "Block": "3125800077",
      "BillToState": "11",
      "ExemptNum": null,
      "Priority": -1,
      "FormCode1099": null,
      "Box1099": null,
      "PeymentMethodCode": "-1",
      "BackOrder": "tYES",
      "PartialDelivery": "tYES",
      "BlockDunning": "tNO",
      "BankCountry": null,
      "HouseBank": "",
      "HouseBankCountry": "CO",
      "HouseBankAccount": "",
      "ShipToDefault": "FAC-Nro2",
      "DunningLevel": null,
      "DunningDate": null,
      "CollectionAuthorization": "tNO",
      "DME": null,
      "InstructionKey": null,
      "SinglePayment": "tNO",
      "ISRBillerID": null,
      "PaymentBlock": "tNO",
      "ReferenceDetails": null,
      "HouseBankBranch": "",
      "OwnerIDNumber": null,
      "PaymentBlockDescription": -1,
      "TaxExemptionLetterNum": null,
      "MaxAmountOfExemption": 0,
      "ExemptionValidityDateFrom": null,
      "ExemptionValidityDateTo": null,
      "LinkedBusinessPartner": null,
      "LastMultiReconciliationNum": null,
      "DeferredTax": "tNO",
      "Equalization": "tNO",
      "SubjectToWithholdingTax": "tNO",
      "CertificateNumber": null,
      "ExpirationDate": null,
      "NationalInsuranceNum": null,
      "AccrualCriteria": "tNO",
      "WTCode": null,
      "BillToBuildingFloorRoom": "3125800077",
      "DownPaymentClearAct": "28050501",
      "ChannelBP": null,
      "DefaultTechnician": null,
      "BilltoDefault": "FAC-Nro2",
      "CustomerBillofExchangDisc": null,
      "Territory": null,
      "ShipToBuildingFloorRoom": "3125800077",
      "CustomerBillofExchangPres": null,
      "ProjectCode": null,
      "VatGroupLatinAmerica": null,
      "DunningTerm": null,
      "Website": null,
      "OtherReceivablePayable": null,
      "BillofExchangeonCollection": null,
      "CompanyPrivate": "cCompany",
      "LanguageCode": 25,
      "UnpaidBillofExchange": null,
      "WithholdingTaxDeductionGroup": -1,
      "ClosingDateProcedureNumber": null,
      "Profession": null,
      "BankChargesAllocationCode": null,
      "TaxRoundingRule": "trr_CompanyDefault",
      "Properties1": "tNO",
      "Properties2": "tNO",
      "Properties3": "tNO",
      "Properties4": "tNO",
      "Properties5": "tNO",
      "Properties6": "tNO",
      "Properties7": "tNO",
      "Properties8": "tNO",
      "Properties9": "tNO",
      "Properties10": "tNO",
      "Properties11": "tNO",
      "Properties12": "tNO",
      "Properties13": "tNO",
      "Properties14": "tNO",
      "Properties15": "tNO",
      "Properties16": "tNO",
      "Properties17": "tNO",
      "Properties18": "tNO",
      "Properties19": "tNO",
      "Properties20": "tNO",
      "Properties21": "tNO",
      "Properties22": "tNO",
      "Properties23": "tNO",
      "Properties24": "tNO",
      "Properties25": "tNO",
      "Properties26": "tNO",
      "Properties27": "tNO",
      "Properties28": "tNO",
      "Properties29": "tNO",
      "Properties30": "tNO",
      "Properties31": "tNO",
      "Properties32": "tNO",
      "Properties33": "tNO",
      "Properties34": "tNO",
      "Properties35": "tNO",
      "Properties36": "tNO",
      "Properties37": "tNO",
      "Properties38": "tNO",
      "Properties39": "tNO",
      "Properties40": "tNO",
      "Properties41": "tNO",
      "Properties42": "tNO",
      "Properties43": "tNO",
      "Properties44": "tNO",
      "Properties45": "tNO",
      "Properties46": "tNO",
      "Properties47": "tNO",
      "Properties48": "tNO",
      "Properties49": "tNO",
      "Properties50": "tNO",
      "Properties51": "tNO",
      "Properties52": "tNO",
      "Properties53": "tNO",
      "Properties54": "tNO",
      "Properties55": "tNO",
      "Properties56": "tNO",
      "Properties57": "tNO",
      "Properties58": "tNO",
      "Properties59": "tNO",
      "Properties60": "tNO",
      "Properties61": "tNO",
      "Properties62": "tNO",
      "Properties63": "tNO",
      "Properties64": "tNO",
      "CompanyRegistrationNumber": null,
      "VerificationNumber": null,
      "DiscountBaseObject": "dgboNone",
      "DiscountRelations": "dgrLowestDiscount",
      "TypeReport": "atCompany",
      "ThresholdOverlook": "tNO",
      "SurchargeOverlook": "tNO",
      "DownPaymentInterimAccount": null,
      "OperationCode347": "ocGoodsOrServiciesAcquisitions",
      "InsuranceOperation347": "tNO",
      "HierarchicalDeduction": "tNO",
      "ShaamGroup": "sgServicesAndAsset",
      "WithholdingTaxCertified": "tNO",
      "BookkeepingCertified": "tNO",
      "PlanningGroup": null,
      "Affiliate": "tNO",
      "Industry": null,
      "VatIDNum": null,
      "DatevAccount": null,
      "DatevFirstDataEntry": "tYES",
      "GTSRegNo": null,
      "GTSBankAccountNo": null,
      "GTSBillingAddrTel": null,
      "ETaxWebSite": null,
      "HouseBankIBAN": "",
      "VATRegistrationNumber": null,
      "RepresentativeName": null,
      "IndustryType": null,
      "BusinessType": null,
      "Series": 1,
      "AutomaticPosting": "apNo",
      "InterestAccount": null,
      "FeeAccount": null,
      "CampaignNumber": null,
      "AliasName": null,
      "DefaultBlanketAgreementNumber": null,
      "EffectiveDiscount": "dgrLowestDiscount",
      "NoDiscounts": "tNO",
      "GlobalLocationNumber": null,
      "EDISenderID": null,
      "EDIRecipientID": null,
      "ResidenNumber": "rntSpanishFiscalID",
      "RelationshipCode": null,
      "RelationshipDateFrom": null,
      "RelationshipDateTill": null,
      "UnifiedFederalTaxID": null,
      "AttachmentEntry": null,
      "TypeOfOperation": null,
      "EndorsableChecksFromBP": "tYES",
      "AcceptsEndorsedChecks": "tNO",
      "OwnerCode": null,
      "BlockSendingMarketingContent": "tNO",
      "AgentCode": null,
      "EDocGenerationType": null,
      "EDocStreet": null,
      "EDocStreetNumber": null,
      "EDocBuildingNumber": null,
      "EDocZipCode": null,
      "EDocCity": null,
      "EDocCountry": null,
      "EDocDistrict": null,
      "EDocRepresentativeFirstName": null,
      "EDocRepresentativeSurname": null,
      "EDocRepresentativeCompany": null,
      "EDocRepresentativeFiscalCode": null,
      "EDocRepresentativeAdditionalId": null,
      "EDocPECAddress": null,
      "IPACodeForPA": null,
      "UpdateDate": 1521522000000,
      "UpdateTime": "1644:45:00",
      "ExemptionMaxAmountValidationType": "emaIndividual",
      "ECommerceMerchantID": null,
      "U_EsAutorret": "N",
      "U_BPCO_RTC": "RS",
      "U_BPCO_TDC": "13",
      "U_BPCO_CS": "11001",
      "U_BPCO_City": "11001",
      "U_BPCO_TP": "01",
      "U_BPCO_Nombre": "MARIA ANGELICA",
      "U_BPCO_1Apellido": "FLORES",
      "U_BPCO_2Apellido": "GIL",
      "U_BPCO_BPExt": "01",
      "U_BPCO_TBPE": "01",
      "U_BPCO_Address": "BOGOTA",
      "U_Manejo": "DIA",
      "U_BD_Erst": "Y",
      "U_BD_Datev": null,
      "U_saldoCL": null,
      "U_FechaNacimiento": -2208971024000,
      "U_Sexo": "2",
      "U_OK1_AC_ECO": null,
      "U_FactorRedondeo": null,
      "U_IdCatTer": null,
      "BPAddresses": {
        "BPAddress": [
          {
            "AddressName": "FAC-Nro2",
            "Street": "BOGOTA",
            "Block": "3125800077",
            "ZipCode": null,
            "City": "BOGOTÁ",
            "County": '',
            "Country": "CO",
            "State": "11",
            "FederalTaxID": "15584182",
            "TaxCode": "",
            "BuildingFloorRoom": "3125800077",
            "AddressType": "bo_ShipTo",
            "AddressName2": null,
            "AddressName3": null,
            "TypeOfAddress": null,
            "StreetNo": null,
            "BPCode": "15584182CL",
            "RowNum": 1,
            "GlobalLocationNumber": null,
            "Nationality": null,
            "TaxOffice": null,
            "GSTIN": null,
            "GstType": null,
            "U_Municipio": "11001"
          }


        ]
      },
      "ContactEmployees": {
        "ContactEmployee": null
      },
      "BPAccountReceivablePaybleCollection": {
        "BPAccountReceivablePayble": null
      },
      "BPPaymentMethods": {
        "BPPaymentMethod": null
      },
      "BPWithholdingTaxCollection": {
        "BPWithholdingTax": null
      },
      "BPPaymentDates": {
        "BPPaymentDate": null
      },
      "BPBranchAssignment": {
        "BPBranchAssignmentItem": null
      },
      "BPBankAccounts": {
        "BPBankAccount": null
      },
      "BPFiscalTaxIDCollection": {
        "BPFiscalTaxID": null
      },
      "DiscountGroups": {
        "DiscountGroup": null
      },
      "BPIntrastatExtension": null,
      "BPBlockSendingMarketingContents": {
        "BPBlockSendingMarketingContent": null
      }
    }
  }

  onFileChange(event, tipo: string) {
    let fileList: FileList = event.target.files;

    if (tipo == 'fileUploadRut' && fileList.length > 0) {
      this.fileUploadRut = 'Y';
    }

    if (tipo == 'fileUploadCc' && fileList.length > 0) {
      this.fileUploadCc = 'Y';
    }

    if (tipo == 'fileUploadCert' && fileList.length > 0) {
      this.fileUploadCert = 'Y';
    }

    if (tipo == 'fileUploadTp' && fileList.length > 0) {
      this.fileUploadTp = 'Y';
    }

    if (this.customer.fiscalID == null || this.customer.fiscalID == '' || this.customer.fiscalID == 'undefined') {
      this.messageError = 'Debes cargar el documento de identidad del usuario.';
      $('#messageUser').modal('show');
    } else {
      if (fileList.length > 0) {
        let file: File = fileList[0];
        let fileSize: number = fileList[0].size;
        // let tipopng: string = 'image/png';
        // let tipojpg: string = 'image/jpeg';
        for (let i = 0; i < fileList.length; i++) {
          let file: File = fileList[i];
          let fileSize: number = fileList[i].size;
          let formData: FormData = new FormData();
          let nameA = file.name.split('.');
          
          formData.append('file', file);
          formData.append('codigo', this.customer.fiscalID);
          formData.append('nombrearchivo', nameA[0]);

          if (this.registroDecorador != null) {
            formData.append('decorador', 'decorador');
            formData.append('planificador', '');
          }

          if (this.registroPlanificador != null) {
            formData.append('planificador', 'planificador');
            formData.append('decorador', '');
          }

          this._userService.subirImagen(formData).subscribe(
            response => {
              let respuesta = JSON.parse(JSON.stringify(response));
            },
            error => { console.error(error); }
          );
        }

        // if (fileSize <= 10485760) {
        //   let formData: FormData = new FormData();
        //   formData.append('file', file);
        //   formData.append('codigo', this.codigoLista);
        //   this._listaService.subirImagenLista(formData).subscribe(
        //     response => {
        //       let respuesta = JSON.parse(JSON.stringify(response));
        //       this.existeUrl(this.urlAvatar + this.codigoLista + '.png');
        //       location.reload();
        //       $(".perfil-imagen").css("background-image", "url(" + this.urlAvatar + this.codigoLista + ".jpg)");
        //       this.navigate();
        //     },
        //     error => { console.error(error); }
        //   );
        // }
        // else {
        //   this.messageError = 'Tamaño máximo superado';
        // }
      }
      else {
        this.messageError = 'Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.';
      }
    }
  }

  public vaciarDocumento(tipoDocumento: string) {
    if (tipoDocumento == "31") {
      this.customer.fiscalID = "";
    } else {
      this.customer.cardName = "";
    }
  }
}