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

  public token: string;
  public sesionPOS: any;
  public mensajeInicio: string;
  public mensajeError: string;
  public permitirAbrirCaja: boolean = false;

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
  public cuadricula: boolean = false;
  public modoBono: boolean = false;
  public itemEliminar: any;
  public items: Array<any>;
  public ventasPendientes: Array<any>;

  // Variables de tarjetas matisses
  public valorTarjetaMatisses: number;
  public cantidadTarjetaMatisses: number;

  // Variables de pagos
  public documentoCliente: string;
  public mensajeErrorCliente: string;
  public cliente: any;

  public medioPago: number;
  public valorEfectivo: number;

  public tipoPagoTarjeta: number;
  public valorTarjeta: number;
  public totalBase: number;
  public totalIVA: number;
  public baseIVA: number;
  public valorIVA: number;
  public valorTotalTarjetas: number = 0;
  public indexTarjeta: number;
  public ultimosDigitos: string;
  public voucher: string;
  public franquiciaSeleccionada: any;
  public franquicias: Array<any>;
  public pagosTarjeta: Array<any>;

  public saldoFavorDisponible: number;
  public valorSaldoFavor: number;
  public mensajeSaldoFavor: string;

  public totalVenta: number;
  public pendienteVenta: number;
  public cambioVenta: number = 0;

  // Variables de facturacion
  public pasoFacturacion: number;
  public itemSeleccionado: number;
  public itemFactura: any;
  public ubicaciones: Array<any>;
  public empleados: Array<any>;
  public sucursales: Array<any>;
  public empleadosSeleccionados: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _jwt: JWTService, private _posService: PosService) {
    this.sesionPOS = {
      idTurnoCaja: '',
      tarjetasRegaloDisponibles: 0,
      usuario: '',
      nombreUsuario: '',
      almacen: '',
      mensajeError: '',
      ip: '',
      cuentaEfectivo: '',
      nombreCaja: '',
      sesionValida: false,
      cajaAbierta: false
    }
    this.denominaciones = new Array<any>();
    this.items = new Array<any>();
    this.franquicias = new Array<any>();
    this.pagosTarjeta = new Array<any>();
    this.inicializarCliente();
  }

  ngOnInit() {
    this.validarToken();
    $('#modalAutorizacion').on('shown.bs.modal', function() {
      $('#usuarioAutoriza').focus()
    });

    $('#modalBono').on('shown.bs.modal', function() {
      $('#valorBono').focus()
    });
  }

  private validarToken() {
    this._route.params.forEach((params: Params) => {
      this.token = params['token'];
      this._jwt.validateToken(this.token).subscribe(
        response => {
          // Ocultar el footer
          $('#footer').addClass('hidden-xs hidden-md hidden-sm hidden-lg');

          if (response.estado === 0) {
            this.sesionPOS = response;
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
        if (response.mensajeError && response.mensajeError.length > 0) {
          this.mensajeInicio = response.mensajeError;
        } else {
          if (response.cajaAbierta) {
            this.sesionPOS.cajaAbierta = true;
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
        usuario: this.sesionPOS.usuario,
        tipo: 'apertura',
        valor: this.totalCaja
      }
      this._posService.abrirCaja(transaccion).subscribe(
        response => {
          if (response) {
            this.sesionPOS.cajaAbierta = true;
            $('#modalCaja').modal('hide');
            this.validarToken();
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

  private inicializarCliente() {
    this.cliente = {
      cardCode: '',
      birthDate: '',
      cardName: '',
      cardType: '',
      defaultBillingAddress: '',
      defaultShippingAddress: '',
      firstName: '',
      fiscalID: '',
      fiscalIdType: '',
      foreignType: '',
      gender: '',
      lastName1: '',
      lastName2: '',
      nationality: '',
      personType: '',
      salesPersonCode: '',
      selfRetainer: '',
      taxRegime: '',
      addresses: [{
        address: '',
        addressName: '',
        addressType: '',
        cellphone: '',
        cityCode: '',
        cityName: '',
        country: '',
        email: '',
        landLine: '',
        stateCode: '',
        stateName: '',
        taxCode: ''
      }]
    };
  }

  public agregarItem() {
    this.mensajeError = '';
    if (this.referencia != null && this.referencia.length > 0) {
      this._posService.agregarReferencia(this.referencia, this.sesionPOS.almacen).subscribe(
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
                this.calcularTotalVenta();
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
                  this.calcularTotalVenta();
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

  public agregarTarjetaRegalo() {
    //TODO: Se debe validar que no haya mas de un registro para bono
    this.mensajeError = '';
    this.modoBono = false;
    if (this.valorTarjetaMatisses != null && this.valorTarjetaMatisses > 0 && this.cantidadTarjetaMatisses != null && this.cantidadTarjetaMatisses > 0) {
      let item = {
        itemCode: 'BONO',
        shortItemCode: 'BONO',
        itemName: 'TARJETA DE REGALO MATISSES (' + this.cantidadTarjetaMatisses + ' TARJETAS)',
        price: this.valorTarjetaMatisses,
        providerCode: '000000',
        cantidad: 1
      }

      this.items.unshift(item);
      this.valorTarjetaMatisses = null;
      this.cantidadTarjetaMatisses = null;
      this.calcularTotalVenta();
      this.modoBono = true;

      $('#modalBono').modal('hide');
    } else {
      this.mensajeError = 'Todos los campos son obligatorios.';
    }
  }

  public seleccionarItemEliminar(item: any) {
    this.itemEliminar = item;
    $('#modalItemEliminar').modal('show');
  }

  public eliminarItem(cantidadEliminar: number) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.itemEliminar.itemCode === this.items[i].itemCode) {
        if (this.items[i].cantidad === cantidadEliminar) {
          this.items.splice(i, 1);
        } else {
          if (this.items[i].cantidad > 1) {
            this.items[i].cantidad--;
          } else {
            this.items.splice(i, 1);
          }
        }

        this.calcularTotalVenta();
        $('#modalItemEliminar').modal('hide');
        break;
      }
    }
  }

  public mostrarCuadricula() {
    if (this.cuadricula) {
      this.cuadricula = false;
    } else {
      this.cuadricula = true;
    }
  }

  public abrirModalBono() {
    if (this.items == null || this.items.length <= 0) {
      $('#modalBono').modal('show');
    }
  }

  public obtenerDatosCliente() {
    this.mensajeErrorCliente = '';
    if (this.documentoCliente != null && this.documentoCliente.length > 0) {
      this._posService.consultarDatosCliente(this.documentoCliente).subscribe(
        response => {
          console.log(response);
          if (response.cardCode != null && response.cardCode.length > 0) {
            this.cliente = response;
            this.documentoCliente = null;
            if (this.medioPago === 5) {
              this.obtenerSaldoFavorCliente();
            }
          } else {
            this.mensajeErrorCliente = 'No se encontró  el cliente con documento: ' + this.documentoCliente;
          }
        },
        error => {
          console.log(error);
          this.mensajeErrorCliente = 'No se encontró  el cliente con documento: ' + this.documentoCliente;
        }
      );
    }
  }

  private calcularTotalVenta() {
    this.totalVenta = 0;
    this.totalBase = 0;
    this.totalIVA = 0;
    if (this.items != null && this.items.length > 0) {
      for (let i = 0; i < this.items.length; i++) {
        let totalLinea: number = 0;
        let totalIvaLinea: number = 0;

        if (this.items[i].discountPercent > 0) {
          totalLinea = (((this.items[i].price * this.items[i].cantidad) / 100) * this.items[i].discountPercent);
        } else {
          totalLinea = (this.items[i].price * this.items[i].cantidad);
        }

        totalIvaLinea = (parseInt(this.items[i].taxRate) * totalLinea) / (100 + parseInt(this.items[i].taxRate));

        this.totalIVA += Math.round(totalIvaLinea);
        this.totalVenta += totalLinea;
      }

      this.totalBase += this.totalVenta - this.totalIVA;
    }
    this.calcularPendienteVenta();
  }

  private calcularPendienteVenta() {
    this.pendienteVenta = this.totalVenta;

    if (this.valorTotalTarjetas != null && this.valorTotalTarjetas > 0) {
      this.pendienteVenta -= this.valorTotalTarjetas;
    }
    if (this.valorSaldoFavor != null && this.valorSaldoFavor > 0) {
      this.pendienteVenta -= this.valorSaldoFavor;
    }
    if (this.valorEfectivo != null && this.valorEfectivo > 0) {
      this.pendienteVenta -= this.valorEfectivo;
    }

    if (this.pendienteVenta < 0) {
      this.pendienteVenta = 0;
    }

    this.cambioVenta = ((this.totalVenta - (this.valorEfectivo + this.valorTotalTarjetas + (this.valorSaldoFavor > 0 ? this.valorSaldoFavor : 0))) * -1);
    if (this.cambioVenta < 0) {
      this.cambioVenta = 0;
    }
  }

  public seleccionarMedioPago(medioPago: number) {
    this.medioPago = medioPago;

    if (this.medioPago === 1) {
      $('#efectivo').focus();
    } else if (this.medioPago === 3 && (this.franquicias === null || this.franquicias.length <= 0)) {
      this.obtenerFranquicias();
    } else if (this.medioPago === 5) {
      $('#saldoFavor').focus();
      this.obtenerSaldoFavorCliente();
    }
  }

  private obtenerFranquicias() {
    this.mensajeError = '';
    this._posService.obtenerFranquicias(this.sesionPOS.almacen).subscribe(
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

  public calcularDatosIVA() {
    let porcentaje = this.valorTarjeta / this.totalVenta;

    this.baseIVA = Math.round((this.totalBase * porcentaje));
    this.valorIVA = Math.round((this.totalIVA * porcentaje));
  }

  public agregarPagoTarjeta() {
    this.mensajeError = '';
    if (this.tipoPagoTarjeta === 2) {
      if (this.franquiciaSeleccionada == null) {
        this.mensajeError = 'Debe seleccionar una franquicia.';
        return;
      }
      if (this.franquiciaSeleccionada.type === 'credit' &&
        (this.ultimosDigitos == null || this.ultimosDigitos.toString().length <= 0 || this.voucher == null || this.voucher.toString().length <= 0 ||
          this.valorTarjeta == null || this.valorTarjeta <= 0)) {
        this.mensajeError = 'Debe llenar todos los campos obligatorios.';
        return;
      }
      if (this.franquiciaSeleccionada.type === 'credit' && (this.ultimosDigitos.toString().length < 4 || this.ultimosDigitos.toString().length > 5)) {
        this.mensajeError = 'Los dígitos de la tarjeta no son válidos..';
        return;
      }

      let porcentaje = this.valorTarjeta / this.totalVenta;
      let pagoTarjeta = {
        tipoTransaccion: 'M',
        tipo: this.franquiciaSeleccionada.creditCardId,
        franquicia: this.franquiciaSeleccionada.franchiseName,
        valor: this.valorTarjeta,
        tarjeta: this.franquiciaSeleccionada.type === 'debit' ? 'N/A' : this.ultimosDigitos,
        voucher: this.voucher,
        base: this.totalBase * porcentaje,
        iva: this.totalIVA * porcentaje
      }

      if (this.indexTarjeta != null) {
        this.valorTotalTarjetas -= this.pagosTarjeta[this.indexTarjeta].valor;

        this.pagosTarjeta[this.indexTarjeta].tipoTransaccion = pagoTarjeta.tipoTransaccion;
        this.pagosTarjeta[this.indexTarjeta].valor = pagoTarjeta.valor;
        this.pagosTarjeta[this.indexTarjeta].base = pagoTarjeta.base;
        this.pagosTarjeta[this.indexTarjeta].iva = pagoTarjeta.iva;
        this.pagosTarjeta[this.indexTarjeta].tarjeta = pagoTarjeta.tarjeta;
        this.pagosTarjeta[this.indexTarjeta].voucher = pagoTarjeta.voucher;
        this.pagosTarjeta[this.indexTarjeta].franquicia = pagoTarjeta.franquicia;
        this.pagosTarjeta[this.indexTarjeta].tipo = pagoTarjeta.tipo;

        this.aplicarPagoTarjeta(pagoTarjeta);
      } else {
        this.pagosTarjeta.push(pagoTarjeta);
        this.aplicarPagoTarjeta(pagoTarjeta);
      }
    }
  }

  public eliminarPagoTarjeta() {
    this.valorTotalTarjetas -= this.pagosTarjeta[this.indexTarjeta].valor;
    this.pagosTarjeta.splice(this.indexTarjeta, 1);
    this.limpiarDatosPagoTarjeta();
  }

  private aplicarPagoTarjeta(pagoTarjeta: any) {
    this.valorTotalTarjetas += pagoTarjeta.valor;
    this.limpiarDatosPagoTarjeta();
  }

  public seleccionarPagoTarjeta(posicion: number) {
    //TODO: Los pagos con tarjeta realizados automaticamente no se pueden editar
    this.tipoPagoTarjeta = this.pagosTarjeta[posicion].tipoTransaccion === 'M' ? 2 : 1;
    this.valorTarjeta = this.pagosTarjeta[posicion].valor;
    this.totalBase = this.pagosTarjeta[posicion].base;
    this.totalIVA = this.pagosTarjeta[posicion].iva;
    this.ultimosDigitos = this.pagosTarjeta[posicion].tarjeta === 'N/A' ? '' : this.pagosTarjeta[posicion].tarjeta;
    this.voucher = this.pagosTarjeta[posicion].voucher;

    for (let i = 0; i < this.franquicias.length; i++) {
      if (this.franquicias[i].franchiseName === this.pagosTarjeta[posicion].franquicia) {
        this.franquiciaSeleccionada = this.franquicias[i];
        break;
      }
    }

    this.indexTarjeta = posicion;
    $('#modalTarjetas').modal('show');
  }

  private obtenerSaldoFavorCliente() {
    this.mensajeSaldoFavor = '';
    if (this.cliente.cardCode == null || this.cliente.cardCode.length <= 0) {
      this.mensajeSaldoFavor = 'Debe ingresar el documento del cliente primero para ejecutar la consulta.';
      return;
    }

    this._posService.consultarSaldoFavorCliente(this.cliente.cardCode).subscribe(
      response => {
        if (response > 0) {
          this.saldoFavorDisponible = response;
        } else {
          this.saldoFavorDisponible = 0;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public aplicarSaldoFavor() {
    if (this.valorSaldoFavor > this.saldoFavorDisponible) {
      this.valorSaldoFavor = this.saldoFavorDisponible;
    } else if (this.valorSaldoFavor > this.totalVenta) {
      this.valorSaldoFavor = this.totalVenta;
    }
  }

  public asignarValorTotal(tipo) {
    console.log('Asignando valor total a ' + tipo)
    let totalPendiente = this.totalVenta;

    if (this.valorEfectivo != null && this.valorEfectivo > 0) {
      totalPendiente -= this.valorEfectivo;
    }
    if (this.valorSaldoFavor != null && this.valorSaldoFavor > 0) {
      totalPendiente -= this.valorSaldoFavor;
    }
    if (this.valorTotalTarjetas != null && this.valorTotalTarjetas > 0) {
      totalPendiente -= this.valorTotalTarjetas;
    }

    if (totalPendiente > 0) {
      if (tipo === 'efectivo') {
        this.valorEfectivo = totalPendiente;
      } else if (tipo === 'tarjeta') {
        this.valorTarjeta = totalPendiente;
      } else if (tipo === 'saldoFavor') {
        this.valorSaldoFavor = totalPendiente;
        this.aplicarSaldoFavor();
      }
    }
    this.calcularPendienteVenta();
  }

  public validarTipoVenta() {
    if (this.modoBono) {

    } else {
      this.mostrarModalFactura();
    }
  }

  private mostrarModalFactura() {
    this.validarSaldoProductos(true);
  }

  private validarSaldoProductos(mostrarModal: boolean) {
    this.pasoFacturacion = 1;
    this.itemFactura = null;
    let referencias = [];

    for (let i = 0; i < this.items.length; i++) {
      referencias.push(this.items[i].itemCode);
    }

    this._posService.obtenerStockItem(this.sesionPOS.almacen, referencias).subscribe(
      response => {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
          for (let j = 0; j < this.items.length; j++) {
            if (response[i].itemCode === this.items[j].itemCode) {
              this.items[j].stock = response[i].stock;
              this.items[j].availableQuantity = response[i].availableQuantity;
              break;
            }
          }
        }

        if (mostrarModal) {
          this.itemFactura = this.items[0];
          this.mostrarUbicaciones();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private mostrarUbicaciones() {
    // Se selecciona el primer articulo para mostrarlo
    this.itemSeleccionado = 0;
    this.ubicaciones = new Array<any>();

    if (this.items != null && this.items.length > 0) {
      for (let i = 0; i < this.items.length; i++) {
        for (let j = 0; j < this.items[i].stock.length; j++) {
          this.agregarUbicacion(this.items[i].stock[j].binAbs, this.items[i].stock[j].quantity, this.items[i].itemCode, this.items[i].stock[j].warehouseCode, this.items[i].stock[j].binCode);
        }
      }

      $('#modalFactura').modal('show');
    }
  }

  private agregarUbicacion(binAbs: number, cantidad: number, referencia: string, almacen: string, binCode: string) {
    let i = 0;

    while (i < this.ubicaciones.length) {
      if (this.ubicaciones[i].referencia === referencia) {
        break;
      }
      i++;
    }

    if (i < this.ubicaciones.length) {
      // La referencia YA ha sido agregada, solo agregar el detalle de la ubicacion
      if (binCode.indexOf('COMPL') >= 0) {
        this.ubicaciones[i].exhibicion.disponible += cantidad;
        if (this.ubicaciones[i].exhibicion.binAbs === 0) {
          this.ubicaciones[i].exhibicion.binAbs = binAbs;
        }
        this.ubicaciones[i].exhibicion.whsCode = almacen;
      } else {
        this.ubicaciones[i].bodega.disponible += cantidad;
        this.ubicaciones[i].bodega.ubicacionesBodega.push({
          whsCode: almacen,
          binCode: binCode,
          binAbs: binAbs,
          disponible: cantidad,
          seleccionado: 0
        });
      }
    } else {
      // La referencia No ha sido agregada, agregar registro completo
      let ubicacionProducto = {};

      if (binCode.indexOf('COMPL') >= 0) {
        // Exhibicion
        ubicacionProducto = {
          referencia: referencia,
          exhibicion: {
            whsCode: almacen,
            binAbs: binAbs,
            disponible: cantidad,
            seleccionado: 0
          },
          bodega: {
            disponible: cantidad,
            seleccionado: 0,
            ubicacionesBodega: []
          }
        }
      } else {
        // Bodega
        ubicacionProducto = {
          referencia: referencia,
          exhibicion: {
            binAbs: 0,
            disponible: 0,
            seleccionado: 0
          },
          bodega: {
            disponible: cantidad,
            seleccionado: 0,
            ubicacionesBodega: [{
              whsCode: almacen,
              binCode: binCode,
              binAbs: binAbs,
              disponible: cantidad,
              seleccionado: 0
            }]
          }
        }
      }
      this.ubicaciones.push(ubicacionProducto);
    }
  }

  public agregarCantidadUbicacion(tipoAlmacen: string) {
    this.mensajeError = '';
    if (tipoAlmacen === 'b') {
      if (this.ubicaciones[this.itemSeleccionado].bodega.seleccionado === this.ubicaciones[this.itemSeleccionado].bodega.disponible) {
        this.mensajeError = 'No hay más saldo para asignar';
        return;
      } else if (this.items[this.itemSeleccionado].cantidad === (this.ubicaciones[this.itemSeleccionado].bodega.seleccionado + this.ubicaciones[this.itemSeleccionado].exhibicion.seleccionado)) {
        this.mensajeError = 'No se pueden seleccionar más productos de los necesarios';
        return;
      } else {
        this.ubicaciones[this.itemSeleccionado].bodega.seleccionado++;

        for (let i = 0; i < this.ubicaciones[this.itemSeleccionado].bodega.ubicacionesBodega.length; i++) {
          if (this.ubicaciones[this.itemSeleccionado].bodega.ubicacionesBodega[i].seleccionado < this.ubicaciones[this.itemSeleccionado].bodega.ubicacionesBodega[i].disponible) {
            // Se incrementara la cantidad seleccionda de la ubicacion
            this.ubicaciones[this.itemSeleccionado].bodega.ubicacionesBodega[i].seleccionado++;
            break;
          }
        }
      }
    } else {
      if (this.ubicaciones[this.itemSeleccionado].exhibicion.seleccionado === this.ubicaciones[this.itemSeleccionado].exhibicion.disponible) {
        this.mensajeError = 'No hay más saldo para asignar';
        return;
      } else if (this.items[this.itemSeleccionado].cantidad === (this.ubicaciones[this.itemSeleccionado].bodega.seleccionado + this.ubicaciones[this.itemSeleccionado].exhibicion.seleccionado)) {
        this.mensajeError = 'No se pueden seleccionar más productos de los necesarios';
        return;
      } else {
        this.ubicaciones[this.itemSeleccionado].exhibicion.seleccionado++;
      }
    }
  }

  public quitarCantidadUbicacion(tipoAlmacen: string) {
    this.mensajeError = '';
    if (tipoAlmacen === 'b') {
      if (this.ubicaciones[this.itemSeleccionado].bodega.seleccionado === 0) {
        this.mensajeError = 'No se puede quitar más cantidad de las ubicaciones de bodega';
        return;
      } else {
        this.ubicaciones[this.itemSeleccionado].bodega.seleccionado--;

        for (let i = 0; i < this.ubicaciones[this.itemSeleccionado].bodega.ubicacionesBodega.length; i++) {
          if (this.ubicaciones[this.itemSeleccionado].bodega.ubicacionesBodega[i].seleccionado > 0) {
            this.ubicaciones[this.itemSeleccionado].bodega.ubicacionesBodega[i].seleccionado--;
            break;
          }
        }
      }
    } else {
      if (this.ubicaciones[this.itemSeleccionado].exhibicion.seleccionado === 0) {
        this.mensajeError = 'No se puede quitar más cantidad de las ubicaciones de exhibición';
        return;
      } else {
        this.ubicaciones[this.itemSeleccionado].exhibicion.seleccionado--;
      }
    }
  }

  public siguientePaso() {
    this.mensajeError = '';
    if ((this.items.length - 1) > this.itemSeleccionado) {
      if ((this.ubicaciones[this.itemSeleccionado].exhibicion.seleccionado + this.ubicaciones[this.itemSeleccionado].bodega.seleccionado) < this.items[this.itemSeleccionado].cantidad) {
        this.mensajeError = 'Debe asignar la cantidad de las ubicaciones que necesita del ítem para continuar.';
        return;
      }
      this.itemSeleccionado++;
      this.itemFactura = this.items[this.itemSeleccionado];
    } else {
      // Se debe enviar al usuario a que elija los asesores que comisionarian
      this.pasoFacturacion++;
      this.cargarEmpleados();
    }
  }

  public anteriorItem() {
    this.mensajeError = '';
    if (this.itemSeleccionado > 0 &&
      ((this.ubicaciones[this.itemSeleccionado].exhibicion.seleccionado + this.ubicaciones[this.itemSeleccionado].bodega.seleccionado) === this.items[this.itemSeleccionado].cantidad)) {
      this.itemSeleccionado--;
      this.itemFactura = this.items[this.itemSeleccionado];
    } else {
      this.mensajeError = 'Debe asignar la cantidad de las ubicaciones que necesita del ítem para continuar.';
    }
  }

  private cargarEmpleados() {
    this.mensajeError = '';
    this.empleados = new Array<any>();
    this.sucursales = new Array<any>();
    this.empleadosSeleccionados = new Array<any>();

    this._posService.listarEmpleados().subscribe(
      response => {
        if (response.length > 0) {
          this.sucursales = response;
          this.seleccionarSucursal(this.sucursales[0]);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private seleccionarSucursal(sucursal) {
    this.empleados = sucursal.empleados;
  }

  public seleccionarEmpleado(empleado) {
    this.mensajeError = '';
    let posicion = this.obtenerPosicionEmpleado(empleado);

    if (posicion >= 0) {
      this.empleadosSeleccionados.splice(posicion, 1);
    } else {
      if (this.empleadosSeleccionados.length < 5) {
        this.empleadosSeleccionados.push(empleado);
      } else {
        this.mensajeError = 'No puede asignar más de 5 empleados para que comisionen.';
      }
    }
  }

  public obtenerPosicionEmpleado(empleado) {
    let i = 0;
    while (i < this.empleadosSeleccionados.length) {
      if (this.empleadosSeleccionados[i].cedula === empleado.cedula) {
        return i;
      }
      i++;
    }

    return -1;
  }

  public calcularTotalItems() {
    let totalItems = 0;

    for (let i = 0; i < this.items.length; i++) {
      totalItems += this.items[i].cantidad;
    }

    return totalItems;
  }

  public suspenderVenta() {
    if (this.items != null && this.items.length > 0) {
      if (this.cliente.cardCode != null && this.cliente.cardCode.length > 0) {
        let ventapos = {
          estado: "PE",
          nit: this.cliente ? this.cliente.cardCode : null,
          almacen: this.sesionPOS.almacen,
          usuario: this.sesionPOS.usuario,
          productos: this.items,
          idTurnoCaja: this.sesionPOS.idTurnoCaja
        }

        this._posService.suspenderVenta(ventapos).subscribe(
          response => {
            this.limpiarFormularioVenta();
          },
          error => {
            console.log(error);
          }
        );
      } else {
        console.log("No se encontró el nit del cliente");
      }
    } else {
      this.mensajeError = 'No se puede suspender la venta debido a que no ha seleccionado items';
    }
  }

  public listarVentasPendientes() {
    this._posService.listarVentasPendientes('2107').subscribe(
      response => {
        if (response.length > 0) {
          console.log(response);
          this.ventasPendientes = response;
          $('#modalVentasPendientes').modal('show');
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public consultarVentaPendiente(ventaPendiente) {
    this._posService.consultarVentaPendiente(ventaPendiente.idVentaPOS).subscribe(
      response => {
        if (response.length > 0) {
          this.items = response;
          this.cliente.cardCode = ventaPendiente.nit;
          $('#modalVentasPendientes').modal('hide');
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private limpiarVenta() {
    this.referencia = null;
    this.modoBono = false;
    this.valorTarjetaMatisses = null;
    this.cantidadTarjetaMatisses = null;
    this.documentoCliente = null;
    this.mensajeErrorCliente = null
    this.medioPago = null;
    this.valorEfectivo = null;
    this.pagosTarjeta = new Array<any>();
    this.saldoFavorDisponible = null;
    this.valorSaldoFavor = null;
    this.mensajeSaldoFavor = null;
    this.valorTotalTarjetas = 0;
    this.totalVenta = null;

    this.limpiarFormularioVenta();
    this.limpiarDatosPagoTarjeta();

    $('#modalCancelarVenta').modal('hide');
    $('#referencia').focus();
  }

  private limpiarFormularioVenta() {
    this.itemEliminar = null;
    this.items = new Array<any>();
    this.inicializarCliente();
  }

  private limpiarDatosAutorizacion(authorizationForm) {
    $('#modalAutorizacion').modal('hide');
    this.claveAutoriza = null;
    this.usuarioAutoriza = null;
    this.valid = true;
    authorizationForm.reset();
  }

  public limpiarDatosPagoTarjeta() {
    this.tipoPagoTarjeta = null;
    this.valorTarjeta = null;
    this.totalBase = null;
    this.totalIVA = null;
    this.ultimosDigitos = null;
    this.voucher = null;
    this.franquiciaSeleccionada = null;
    this.indexTarjeta = null;

    $('#modalTarjetas').modal('hide');
  }
}
