import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { JWTService } from '../../services/jwt.service';
import { PosService } from '../../services/pos.service';

declare var $: any;

@Component({
  templateUrl: 'pos.html',
  styleUrls: ['pos.component.css'],
  providers: [JWTService, PosService]
})

export class PosComponent implements OnInit {

  public totalCompra: number;
  public token: string;
  public usuario: string;
  public nombreUsuario: string;
  public mensajeInicio: string;
  public mensajeError: string;
  public permitirAbrirCaja: boolean = false;
  public cajaAbierta: boolean = false;

  // Variables de autorizacion
  public usuarioAutoriza: string;
  public claveAutoriza: string;
  public valid: boolean = true;

  // Variables de caja
  public idDenominacion: number;
  public cantidad: number;
  public totalCaja: number;
  public denominaciones: Array<any>;

  // Variables de items
  public referencia: string;
  public items: Array<any>;

  // Variables de pagos
  public medioPago: number;
  public valorEfectivo: number;

  public tipoPagoTarjeta: number;
  public valorTarjeta: number;
  public totalBase: number;
  public totalIVA: number;
  public valorTotalTarjetas: number = 0;
  public ultimosDigitos: string;
  public voucher: string;
  public franquiciaSeleccionada: any;
  public franquicias: Array<any>;
  public pagosTarjeta: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _jwt: JWTService, private _posService: PosService) {
    this.denominaciones = new Array<any>();
    this.items = new Array<any>();
    this.franquicias = new Array<any>();
    this.pagosTarjeta = new Array<any>();
  }

  ngOnInit() {
    this.validarToken();
    $('#modalAutorizacion').on('shown.bs.modal', function() {
      $('#usuarioAutoriza').focus()
    })
  }

  private validarToken() {
    this._route.params.forEach((params: Params) => {
      this.token = params['token'];
      this._jwt.validateToken(this.token).subscribe(
        response => {
          // Ocultar el footer
          $('#footer').addClass('hidden-xs hidden-md hidden-sm hidden-lg');

          if (response.estado === 0) {
            this.usuario = response.usuario;
            this.nombreUsuario = response.nombreUsuario;
            localStorage.setItem('matisses.pos-token', this.token);
            console.log('El token recibido es valido');

            // Se valida el estado actual de la caja en la que se quiere trabajar
            this.validarEstadoCaja();
          } else {
            localStorage.removeItem('matisses.pos-token');
            console.log('El token recibido no es valido');
            this._router.navigate(['/pos']);
          }
        }, error => {
          console.error(error);
          localStorage.removeItem('matisses.pos-token');
        }
      );
    });
  }

  private validarEstadoCaja() {
    this.permitirAbrirCaja = false;
    this._posService.validarSesion(this.token).subscribe(
      response => {
        console.log(response);
        if (response.mensajeError && response.mensajeError.length > 0) {
          this.mensajeInicio = response.mensajeError;
        } else {
          if (response.cajaAbierta) {
            this.cajaAbierta = true;
          } else {
            this.mensajeInicio = 'La caja se encuentra cerrada. Ejecute la operación de apertura de caja para comenzar a realizar ventas.';
            this.permitirAbrirCaja = true;
          }
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  public abrirCaja(validarAutorizacion: boolean, authorizationForm) {
    if (!validarAutorizacion) {
      this.mensajeError = '';
      $('#modalAutorizacion').modal('show');
    } else {
      if (this.usuarioAutoriza == null || this.usuarioAutoriza.length <= 0 || this.claveAutoriza == null || this.claveAutoriza.length <= 0) {
        this.mensajeError = 'Llene todos los campos.';
        return;
      }

      let validarPermisos = {
        usuario: this.usuarioAutoriza,
        clave: this.claveAutoriza,
        accion: 'ABRIR',
        objeto: 'CAJON_MONEDERO'
      }

      this.validarPermisoAutorizacion(validarPermisos, authorizationForm);
    }
  }

  public cerrarModalValidarPermisoAutorizacion(authorizationForm) {
    this.limpiarDatosAutorizacion(authorizationForm);
  }

  private validarPermisoAutorizacion(validarPermisos, authorizationForm) {
    this.mensajeError = '';
    this._posService.validarPermisos(validarPermisos).subscribe(
      response => {
        if (response) {
          this.limpiarDatosAutorizacion(authorizationForm);
          if (validarPermisos.objeto === 'CAJON_MONEDERO') {
            this.ejecutarCaja();
          }
        } else {
          this.mensajeError = 'El usuario no está autorizado o la contraseña es incorrecta.';
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  private ejecutarCaja() {
    this.denominaciones = [
      {
        id: 1,
        tipo: 'Moneda',
        valor: 50,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/50-m.jpg',
        cantidad: 0,
        clase: 'moneda'
      },
      {
        id: 2,
        tipo: 'Moneda',
        valor: 100,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/100-m.jpg',
        cantidad: 0,
        clase: 'moneda'
      },
      {
        id: 3,
        tipo: 'Moneda',
        valor: 200,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/200-m.jpg',
        cantidad: 0,
        clase: 'moneda'
      },
      {
        id: 4,
        tipo: 'Moneda',
        valor: 500,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/500-m.jpg',
        cantidad: 0,
        clase: 'moneda'
      },
      {
        id: 5,
        tipo: 'Moneda',
        valor: 1000,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/1000-m.jpg',
        cantidad: 0,
        clase: 'moneda'
      },
      {
        id: 6,
        tipo: 'Billete',
        valor: 1000,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/1000-b.jpg',
        cantidad: 0,
        clase: 'billete'
      },
      {
        id: 7,
        tipo: 'Billete',
        valor: 2000,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/2000-b.jpg',
        cantidad: 0,
        clase: 'billete'
      },
      {
        id: 8,
        tipo: 'Billete',
        valor: 5000,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/5000-b.jpg',
        cantidad: 0,
        clase: 'billete'
      },
      {
        id: 9,
        tipo: 'Billete',
        valor: 10000,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/10000-b.jpg',
        cantidad: 0,
        clase: 'billete'
      },
      {
        id: 10,
        tipo: 'Billete',
        valor: 20000,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/20000-b.jpg',
        cantidad: 0,
        clase: 'billete'
      },
      {
        id: 11,
        tipo: 'Billete',
        valor: 50000,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/50000-b.jpg',
        cantidad: 0,
        clase: 'billete'
      },
      {
        id: 12,
        tipo: 'Billete',
        valor: 100000,
        urlImagen: 'https://img.matisses.co/360/POS/Billetes%20y%20monedas/100000-b.jpg',
        cantidad: 0,
        clase: 'billete'
      }
    ]
    this.cantidad = null;
    this.totalCaja = 0;
    $('#modalCaja').modal('show');
  }

  public seleccionarDenominacion(id: number) {
    this.idDenominacion = null;
    for (let i = 0; i < this.denominaciones.length; i++) {
      if (this.denominaciones[i].id === id) {
        this.idDenominacion = id;
        this.cantidad = this.denominaciones[i].cantidad;
        this.denominaciones[i].clase += ' img-dinero-activo';
      } else {
        if (this.denominaciones[i].clase.includes('moneda')) {
          this.denominaciones[i].clase = 'moneda';
        } else {
          this.denominaciones[i].clase = 'billete';
        }
      }
    }
  }

  public agregarCantidadDenominacion(denominacion: number) {
    for (let i = 0; i < this.denominaciones.length; i++) {
      if (this.denominaciones[i].id === this.idDenominacion) {
        this.cantidad = (this.cantidad * 10) + denominacion;
        this.denominaciones[i].cantidad = this.cantidad;
        break;
      }
    }
    this.procesarTotalCaja();
  }

  public quitarCantidadDenominacion() {
    for (let i = 0; i < this.denominaciones.length; i++) {
      if (this.denominaciones[i].id === this.idDenominacion) {
        this.cantidad = 0;
        this.denominaciones[i].cantidad = this.cantidad;
        break;
      }
    }
    this.procesarTotalCaja();
  }

  private procesarTotalCaja() {
    this.totalCaja = 0;
    for (let i = 0; i < this.denominaciones.length; i++) {
      this.totalCaja += this.denominaciones[i].cantidad * this.denominaciones[i].valor;
    }
  }

  public ejecutarAperturaCaja() {
    this.mensajeError = null;
    if (this.totalCaja >= 400000) {
      let transaccion = {
        usuario: this.usuario,
        tipo: 'apertura',
        valor: this.totalCaja
      }
      this._posService.abrirCaja(transaccion).subscribe(
        response => {
          if (response) {
            this.cajaAbierta = true;
            $('#modalCaja').modal('hide');
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.mensajeError = 'El valor con que se desea abrir la caja no es válido.';
    }
  }

  public agregarItem() {
    //TODO: Codigo quemado
    this.mensajeError = '';
    if (this.referencia != null && this.referencia.length > 0) {
      this._posService.agregarReferencia(this.referencia, '0203').subscribe(
        response => {
          console.log(response);
          if (response.availableQuantity > 0) {
            let pos = -1;

            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].itemCode === response.itemCode) {
                pos = i;
                break;
              }
            }

            if (pos >= 0) {
              if (response.availableQuantity > this.items[pos].cantidad) {
                this.items[pos].cantidad++;
              } else {
                this.mensajeError = 'Se estan agregando mas productos de los que hay disponibles (' + response.availableQuantity + ')';
                //TODO: modal de saldo insuficiente
                return;
              }
            } else {
              response.cantidad = 1;
              response.shortItemCode = response.itemCode.substring(0, 3) + '*' + response.itemCode.substring(16);
              //Consultar descuentos para el articulo
              this._posService.obtenerDescuento(this.referencia).subscribe(
                response2 => {
                  if (response2 > 0) {
                    response.discountPercent = response2;
                  }

                  this.items.unshift(response);
                },
                error => {
                  console.log(error);
                }
              );
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public seleccionarMedioPago(medioPago: number) {
    this.medioPago = medioPago;

    if (this.medioPago === 1) {
      $('#efectivo').focus();
    } else if (this.medioPago === 3 && (this.franquicias === null || this.franquicias.length <= 0)) {
      this.obtenerFranquicias();
    }
  }

  private obtenerFranquicias() {
    //TODO: Codigo quemado
    this.mensajeError = '';
    this._posService.obtenerFranquicias('0203').subscribe(
      response => {
        console.log(response);
        this.franquicias = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  public seleccionarTipoPagoTarjeta(tipoPagoTarjeta: number) {
    this.tipoPagoTarjeta = tipoPagoTarjeta;
  }

  public seleccionarFranquicia(franquicia: any) {
    this.franquiciaSeleccionada = franquicia;
    $('#digitos').focus();
  }

  public agregarPagoTarjeta() {
    this.mensajeError = '';
    if (this.tipoPagoTarjeta === 2) {
      if (this.franquiciaSeleccionada == null) {
        this.mensajeError = 'Debe seleccionar una franquicia.';
        return;
      }
      if (this.ultimosDigitos == null || this.ultimosDigitos.toString().length <= 0 || this.voucher == null || this.voucher.toString().length <= 0 || this.valorTarjeta == null || this.valorTarjeta <= 0) {
        this.mensajeError = 'Debe llenar todos los campos obligatorios.';
        return;
      }
      if (this.franquiciaSeleccionada.type === 'credit' && (this.ultimosDigitos.toString().length < 4 || this.ultimosDigitos.toString().length > 5)) {
        this.mensajeError = 'Los dígitos de la tarjeta no son válidos..';
        return;
      }

      let porcentaje = this.valorTarjeta / this.totalCompra;
      let pagoTarjeta = {
        tipo: this.franquiciaSeleccionada.creditCardId,
        franquicia: this.franquiciaSeleccionada.franchiseName,
        valor: this.valorTarjeta,
        tarjeta: this.franquiciaSeleccionada.type === 'debit' ? 'N/A' : this.ultimosDigitos,
        voucher: this.voucher,
        base: this.totalBase * porcentaje,
        iva: this.totalIVA * porcentaje
      }

      this.registrarPagoTarjeta(pagoTarjeta);
    }
  }

  private registrarPagoTarjeta(pagoTarjeta: any) {
    this.pagosTarjeta.push(pagoTarjeta);
    this.valorTotalTarjetas += pagoTarjeta.valor;
  }

  private limpiarDatosAutorizacion(authorizationForm) {
    $('#modalAutorizacion').modal('hide');
    this.claveAutoriza = null;
    this.usuarioAutoriza = null;
    this.valid = true;
    authorizationForm.reset();
  }
}
