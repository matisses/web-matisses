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

  private timer;
  public token: string;
  public sesionPOS: any;
  public mensajeInicio: string;
  public mensajeError: string;
  public nombreUsuario: string;
  public permitirAbrirCaja: boolean = false;

  // Variables de autorizacion
  public usuarioAutoriza: string;
  public claveAutoriza: string;
  public accion: string;
  public objeto: string;
  public funcion: string;
  public valid: boolean = true;

  // Variables de caja
  public idDenominacion: number;
  public cantidad: number;
  public totalCaja: number;
  public valorUltimoDeposito: number = 0;
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
  public baseIVA: number = 0;
  public valorIVA: number = 0;
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
  public comentarioFactura: string;
  public estadoFactura: string = '';
  public itemFactura: any;
  public resultadoFactura: any;
  public ubicaciones: Array<any>;
  public empleados: Array<any>;
  public sucursales: Array<any>;
  public empleadosSeleccionados: Array<any>;
  public regalos: Array<any>;

  // Variables de empaque
  public empaques: Array<any>;

  // Variables de anulacion
  public facturaAnularSeleccionada: any;
  public facturasAnulables: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _jwt: JWTService, private _posService: PosService) {
    this.sesionPOS = {
      idTurnoCaja: '',
      tarjetasRegaloDisponibles: 0,
      usuario: '',
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

  private interval() {
    this.timer = setTimeout(this.validarToken(), 1000);
  }

  private abrirModalError() {
    $('#modalError').modal('show');
  }

  private validarToken() {
    //this.mensajeError = '';
    this._route.params.forEach((params: Params) => {
      this.token = params['token'];
      this._jwt.validateToken(this.token).subscribe(
        response => {
          $('#modalError').modal('hide');

          // Ocultar el footer
          $('#footer').addClass('hidden-xs hidden-md hidden-sm hidden-lg');

          if (response.estado === 0) {
            localStorage.setItem('matisses.pos-token', this.token);
            console.log('El token recibido es valido');
            this.sesionPOS = response;
            this.nombreUsuario = response.nombreUsuario;

            // Se valida el estado actual de la caja en la que se quiere trabajar
            this.validarEstadoCaja();
          } else {
            localStorage.removeItem('matisses.pos-token');
            console.log('El token recibido no es valido');
            this._router.navigate(['/pos']);
          }
        }, error => {
          this.mensajeError = 'La conexión con SAP <b>no esta disponibe en este momento</b>. Espera mientras se restablece o vuelve a cargar la página para intentarlo manualmente.';
          console.error(error);
          localStorage.removeItem('matisses.pos-token');
          this.abrirModalError();
          this.interval();
        }
      );
    });
  }

  private validarEstadoCaja() {
    this.permitirAbrirCaja = false;
    this._posService.validarSesion(this.token).subscribe(
      response => {
        this.sesionPOS = response;
        if (response.mensajeError && response.mensajeError.length > 0) {
          this.mensajeInicio = response.mensajeError;
        } else {
          if (response.cajaAbierta) {
            this.sesionPOS.cajaAbierta = true;

            this.obtenerValorApertura();
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

  private obtenerValorApertura() {
    this.totalCaja = 0;

    this._posService.obtenerValorApertura(this.sesionPOS.idTurnoCaja).subscribe(
      response => {
        this.totalCaja = response;
      },
      error => {
        this.totalCaja = 0;
      }
    );
  }

  public abrirModalValidarPermisoAutorizacion(accion, objeto, modal, funcion, authorizationForm) {
    if (modal !== 'undefine') {
      $(modal).modal('hide');
    }

    $('#modalAutorizacion').modal('show');

    this.accion = accion;
    this.objeto = objeto;
    this.funcion = funcion;

    console.log('Accion: ' + this.accion + ', Objeto: ' + this.objeto + ', Funcion: ' + this.funcion);
  }

  public cerrarModalValidarPermisoAutorizacion(authorizationForm) {
    this.limpiarDatosAutorizacion(authorizationForm);
  }

  private validarPermisoAutorizacion(authorizationForm) {
    this.mensajeError = '';
    if (this.usuarioAutoriza == null || this.usuarioAutoriza.length <= 0 || this.claveAutoriza == null || this.claveAutoriza.length <= 0) {
      this.mensajeError = 'Llene todos los campos.';
      return;
    }

    let validarPermisos = {
      usuario: this.usuarioAutoriza,
      clave: this.claveAutoriza,
      accion: this.accion,
      objeto: this.objeto
    }

    console.log(validarPermisos);

    this._posService.validarPermisos(validarPermisos).subscribe(
      response => {
        if (response) {
          this.limpiarDatosAutorizacion(authorizationForm);
          if (validarPermisos.objeto === 'CAJON_MONEDERO') {
            this.abrirCajon();
            if (this.funcion === 'ABRIR CAJON MONEDERO') {
              //this.abrirCajon();
            } else {
              this.ejecutarCaja();
            }
          } else if (this.funcion === 'ANULAR FV') {
            this.anularFV();
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
            $('#referencia').focus();
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

  public validarCierreCaja() {
    this.mensajeError = '';
    //this.totalCaja = null;

    // Consultar el total de transacciones de la caja
    this._posService.obtenerSaldo(this.sesionPOS.usuario).subscribe(
      response => {
        let saldoActual = response;

        // Comparar valor consultado con el valor ingresado
        if (saldoActual !== this.totalCaja) {
          // Si los valores no son iguales, mostrar mensaje de error en ventana de cierre / apertura
          this.mensajeError = 'El monto ingresado no es el esperado. Valor esperado ' + saldoActual;
        } else {
          // Si los valores son iguales, mostrar ventana de confirmacion de ultimo deposito
          this.valorUltimoDeposito = saldoActual - 400000;
          $('#modalCaja').modal('hide');
          $('#modalConfirmacionCierre').modal('show');
        }
      },
      error => {
        console.log(error);
        this.mensajeError = error;
      }
    );
  }

  public cerrarCaja() {
    let transacciones = new Array<any>();

    let transaccionDeposito = {
      usuario: this.sesionPOS.usuario,
      tipo: 'deposito',
      valor: this.valorUltimoDeposito,
      justificacion: null
    }

    let transaccion = {
      usuario: this.sesionPOS.usuario,
      tipo: 'cierre',
      valor: 400000,
      cierre: true
    }

    transacciones.push(transaccionDeposito);
    transacciones.push(transaccion);

    this._posService.transacciones(transacciones).subscribe(
      response => {
        this.sesionPOS.cajaAbierta = false;
        this.limpiar();
        $('#modalConfirmacionCierre').modal('hide');
        this.imprimirInformeCierre();
      },
      error => {
        console.log(error);
      }
    );
  }

  private imprimirInformeCierre() {
    this.mensajeError = '';
    // Consultar datos cierre
    this._posService.consultarDatosCierreCaja(this.sesionPOS.almacen, this.sesionPOS.idTurnoCaja).subscribe(
      response => {
        // Imprimir informe de cierre (tirilla z)
        this._posService.consultarDatosTirillaZ(this.sesionPOS.usuario, this.sesionPOS.idTurnoCaja, response).subscribe(
          response2 => {
            console.log(response2);
            if (response2) {
              let reportData = response2;

              reportData.caja = this.sesionPOS.nombreCaja;
              this._posService.imprimirZ(this.sesionPOS.ip, reportData).subscribe();
              this.validarToken();
            }
          },
          error2 => {
            console.log(error2);
            this.mensajeError = error2;
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }

  private abrirCajon() {
    this._posService.abrirCajon(this.sesionPOS.ip).subscribe();
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
    this.referencia = null;
  }

  public agregarTarjetaRegalo() {
    this.mensajeError = '';
    if (this.valorTarjetaMatisses != null && this.valorTarjetaMatisses > 0 && this.cantidadTarjetaMatisses != null && this.cantidadTarjetaMatisses > 0) {
      let item = {
        itemCode: 'BONO',
        shortItemCode: 'BONO',
        itemName: 'TARJETA DE REGALO MATISSES (' + this.cantidadTarjetaMatisses + ' TARJETAS)',
        price: this.valorTarjetaMatisses,
        providerCode: '000000',
        cantidad: 1
      }

      if (this.modoBono) {
        // Si el carrito ya contiene un bono, lo elimina para agregar los nuevos datos
        this.items.splice(0, 1);
      }

      this.items.unshift(item);
      this.valorTarjetaMatisses = null;
      this.cantidadTarjetaMatisses = null;
      this.calcularTotalVenta();
      this.modoBono = true;

      $('#modalBono').modal('hide');
    } else {
      this.modoBono = false;
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

        if (this.modoBono) {
          this.modoBono = false;
        }

        this.calcularTotalVenta();
        $('#modalItemEliminar').modal('hide');
        $('#referencia').focus();
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
    } else if (this.modoBono) {
      this.valorTarjetaMatisses = this.items[0].price;
      this.cantidadTarjetaMatisses = this.items[0].cantidad;

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
          totalLinea = (this.items[i].price - (((this.items[i].price) / 100) * this.items[i].discountPercent)) * this.items[i].cantidad;
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
        this.calcularPendienteVenta();
      } else {
        this.pagosTarjeta.push(pagoTarjeta);
        this.aplicarPagoTarjeta(pagoTarjeta);
        this.calcularPendienteVenta();
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
        this.calcularDatosIVA();
      } else if (tipo === 'saldoFavor') {
        this.valorSaldoFavor = totalPendiente;
        this.aplicarSaldoFavor();
      }
    }
    this.calcularPendienteVenta();
  }

  public validarTipoVenta() {
    if (this.modoBono) {
      let pagosTarjeta = new Array<any>();

      for (let i = 0; i < this.pagosTarjeta.length; i++) {
        if (this.pagosTarjeta[i] !== null && this.pagosTarjeta[i].tipo !== null && this.pagosTarjeta[i].valor !== null && this.pagosTarjeta[i].tarjeta !== null && this.pagosTarjeta[i].voucher !== null) {
          let pago = {
            franquicia: this.pagosTarjeta[i].tipo,
            valor: this.pagosTarjeta[i].valor,
            digitos: this.pagosTarjeta[i].tarjeta,
            voucher: this.pagosTarjeta[i].voucher
          }

          pagosTarjeta.push(pago);
        }
      }

      let pagosCuenta = [{
        accountCode: '28050503',
        cardCode: this.cliente.cardCode,
        sumPaid: this.totalVenta
      }];

      let venta = {
        usuario: this.sesionPOS.usuario,
        almacen: this.sesionPOS.almacen,
        pagosTarjeta: pagosTarjeta,
        efectivo: this.valorEfectivo === null ? 0 : this.valorEfectivo,
        cuentaEfectivo: this.sesionPOS.cuentaEfectivo,
        nombreCliente: this.cliente ? this.cliente.cardName : null,
        nit: this.cliente ? this.cliente.cardCode : null,
        totalVenta: this.totalVenta,
        pagosCuenta: pagosCuenta,
        estacion: this.sesionPOS.nombreCaja,
        productos: [{
          descripcion: this.items[0].itemName
        }]
      }

      $('#modalEspera').modal('show');

      this._posService.venderTarjetaRagalo(venta).subscribe(
        response => {
          if (response.codigo === '0') {
            //Imprime tirilla
            let operaciones = this.construirPagosParaImpresion(response.mensaje, 'R');

            this._posService.transacciones(operaciones.transaccionesRegistrar).subscribe();

            let receiptData = {
              change: this.cambioVenta,
              cashReceipNumber: response.mensaje,
              printerName: null,
              cashierName: this.sesionPOS.usuario,
              cashRegister: this.sesionPOS.nombreCaja,
              customer: {
                id: venta.nit.replace('CL', ''),
                name: this.cliente.cardName
              },
              payments: operaciones.pagos
            }

            console.log(receiptData);

            this._posService.imprimirReciboCaja(this.sesionPOS.ip, receiptData).subscribe(
              response2 => {
                console.log(response2);
              },
              error2 => {
                console.log(error2);
              }
            );
          }

          $('#modalEspera').modal('hide');
          this.limpiarVenta();
          this.validarToken();
        },
        error => {
          console.log(error);
        }
      );
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

  public facturar() {
    this.mensajeError = '';
    if (this.estadoFactura === null || this.estadoFactura.length <= 0) {
      // No se selecciono un estado para el pedido, por lo que se mandara como entrega inmediata
      this.estadoFactura = 'D';
    }
    if (this.sesionPOS.idTurnoCaja === null) {
      this.mensajeError = 'No se encontró un ID de sesión valido. Cierre sesión y vuelva a intentarlo.';
      return;
    }

    let productos = new Array<any>();

    for (let i = 0; i < this.items.length; i++) {
      let ubicacionesProducto = new Array<any>();

      for (let j = 0; j < this.ubicaciones.length; j++) {
        if (this.ubicaciones[j].referencia === this.items[i].itemCode) {
          if (this.ubicaciones[j].exhibicion.seleccionado > 0) {
            let ubicacion = {
              binAbsEntry: this.ubicaciones[j].exhibicion.binAbs,
              cantidad: this.ubicaciones[j].exhibicion.seleccionado,
              almacen: this.ubicaciones[j].exhibicion.whsCode
            };

            ubicacionesProducto.push(ubicacion);
          }

          if (this.ubicaciones[j].bodega.seleccionado > 0) {
            for (let k = 0; k < this.ubicaciones[j].bodega.ubicacionesBodega.length; k++) {
              let ubicacion = {
                binAbsEntry: this.ubicaciones[j].bodega.ubicacionesBodega[k].binAbs,
                cantidad: this.ubicaciones[j].bodega.ubicacionesBodega[k].seleccionado,
                almacen: this.ubicaciones[j].bodega.ubicacionesBodega[k].whsCode
              };

              ubicacionesProducto.push(ubicacion);
            }
          }
          break;
        }
      }

      let producto = {
        referencia: this.items[i].itemCode,
        descripcion: this.items[i].itemName,
        refProveedor: this.items[i].providerCode,
        cantidad: this.items[i].cantidad,
        precio: this.items[i].price,
        descuento: this.items[i].discountPercent,
        ubicaciones: ubicacionesProducto
      }

      productos.push(producto);
    }

    console.log(productos);

    let pagos = new Array<any>();

    for (let i = 0; i < this.pagosTarjeta.length; i++) {
      if (this.pagosTarjeta[i] !== null && this.pagosTarjeta[i].tipo !== null && this.pagosTarjeta[i].valor !== null && this.pagosTarjeta[i].tarjeta !== null && this.pagosTarjeta[i].voucher !== null) {
        let pago = {
          franquicia: this.pagosTarjeta[i].tipo,
          valor: this.pagosTarjeta[i].valor,
          digitos: this.pagosTarjeta[i].tarjeta,
          voucher: this.pagosTarjeta[i].voucher
        }

        pagos.push(pago);
      }
    }

    let venta = {
      idVentaPOS: this.sesionPOS.idTurnoCaja,
      estado: 'PE',
      estadoPedido: this.estadoFactura,
      asesores: this.empleadosSeleccionados,
      comentarios: this.comentarioFactura,
      nit: this.cliente ? this.cliente.cardCode : null,
      almacen: this.sesionPOS.almacen,
      usuario: this.sesionPOS.usuario,
      productos: productos,
      totalVenta: this.totalVenta,
      efectivo: this.valorEfectivo === null ? 0 : (this.valorEfectivo - this.cambioVenta),
      cuentaEfectivo: this.sesionPOS.cuentaEfectivo,
      certificadosRegalo: null, //TODO: falta
      pagosTarjeta: pagos
    }

    // Cerrar el modal de facturacion y abrir uno de espera
    $('#modalFactura').modal('hide');
    $('#modalEspera').modal('show');

    this._posService.facturar(venta).subscribe(
      response => {
        if (response.codigo === '0') {
          $('#modalEspera').modal('hide');
          this.resultadoFactura = response;
          this.cargarTiposEmpaque();

          $('#modalTerminar').modal('show');

          if (this.resultadoFactura.numeroFactura !== '' && this.resultadoFactura.resolucion !== null) {
            this.regalos = this.resultadoFactura.certificados;

            //Invocar servicio para imprimirrecibo
            let itemsRecibo = new Array<any>();
            let detalleIVA = new Array<any>();

            for (let i = 0; i < this.items.length; i++) {
              let item = {
                itemCode: this.items[i].itemCode,
                itemName: this.items[i].itemName,
                quantity: this.items[i].cantidad,
                price: (this.items[i].price) - ((this.items[i].price / 100) * this.items[i].discountPercent)
              }

              itemsRecibo.push(item);

              let impuestoExiste = false;
              for (let j = 0; j < detalleIVA.length; j++) {
                if (detalleIVA[j].vatName === this.items[i].taxName) {
                  // Acumula el valor base del impuesto
                  detalleIVA[j].baseValue = detalleIVA[j].baseValue + (item.price / (1 + (this.items[i].taxRate / 100))) * this.items[i].cantidad;
                  detalleIVA[j].value = detalleIVA[j].value + ((item.price * this.items[i].cantidad) - ((item.price * this.items[i].cantidad) / (1 + (this.items[i].taxRate / 100))));
                  impuestoExiste = true;
                  break;
                }
              }

              if (!impuestoExiste) {
                // Agrega el nuevo registro de impuesto

                let iva = {
                  vatName: this.items[i].taxName,
                  value: ((item.price * this.items[i].cantidad) - ((item.price * this.items[i].cantidad) / (1 + (this.items[i].taxRate / 100)))),
                  baseValue: (item.price * this.items[i].cantidad) / (1 + (this.items[i].taxRate / 100))
                }

                detalleIVA.push(iva);
              }
            }

            let operaciones = this.construirPagosParaImpresion(this.resultadoFactura.numeroFactura, 'F');

            this._posService.transacciones(operaciones.transaccionesRegistrar).subscribe(
              response2 => {
                this._posService.obtenerSaldo(this.sesionPOS.usuario).subscribe(
                  response3 => {
                    if (response3 > 3000000) {
                      //TODO: Enviar SMS alerta monto caja alto
                    }
                  },
                  error3 => {
                    console.log(error3);
                  }
                );
              },
              error2 => {
                console.log(error2);
              }
            );

            let invoiceData = {
              invoiceNumber: this.resultadoFactura.numeroFactura,
              cashierName: this.sesionPOS.usuario,
              cashRegister: this.sesionPOS.nombreCaja,
              orderStatus: this.estadoFactura,
              invoiceResolution: {
                number: this.resultadoFactura.numero,
                date: this.resultadoFactura.resolucion.fecha,
                prefix: this.resultadoFactura.resolucion.prefijo,
                from: this.resultadoFactura.resolucion.desde,
                to: this.resultadoFactura.resolucion.hasta
              },
              customer: {
                id: venta.nit.replace('CL', ''),
                name: this.cliente.cardName
              },
              change: this.cambioVenta,
              footerText: 'Aviso de privacidad: Los datos personales suministrados en el presente documento seran tratados de manera confidencial, solo para fines comerciales y como base de soporte para la presente negociacion. Igualmente tendran como finalidad informar sobre nuevos productos, promociones y servicios , vinculados o relacionados con nuestra marca Matisses, Distribuciones Baru S.A., propietaria de la marca o en colaboracion con terceros. Cualquier consulta que requiera sobre sus datos personales, puede realizarla por medio de nuestros canales: Pagina web www.matisses.co, correo electronico servicioalcliente@matisses.co, o comunicandose a la linea gratuita nacional matisses 01 8000 41 00 44 - ( 034)444-04-34 Opc 1, en el horario de atencion al cliente de Lunes a viernes de 9:30 am a 12:30 pm y de 1:30 pm a 5:00 pm. Las devoluciones solo seran aceptadas si el producto se entrega en su empaque original y tanto el empaque como el producto se encuentran en perfecto estado. ' + 'Para procesos de garantia, no se aceptaran reclamaciones donde se evidencie el mal uso del producto o el incorrecto seguimiento del manual de instrucciones del mismo.',
              items: itemsRecibo,
              vatDetail: detalleIVA,
              payments: operaciones.pagos,
              binAllocations: this.resultadoFactura.ubicaciones,
              giftCertificates: this.regalos === null ? new Array<any>() : this.regalos
            }

            // Invocar servicio de impresion del equipo que genero la factura
            console.log('Se imprimira el recibo para la factura.');
            this._posService.imprimirRecibo(this.sesionPOS.ip, invoiceData).subscribe(
              response2 => {
                console.log(response2);
              },
              error2 => {
                console.log(error2);
              }
            );
          }
          this.limpiarVenta();
        } else {
          this.mensajeError = response.mensaje;

          $('#modalEspera').modal('hide');
          $('#modalTerminar').modal('show');
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private construirPagosParaImpresion(justificacion, tipoDoc) {
    let pagosRecibo = new Array<any>();
    let transaccionesRegistrar = new Array<any>();

    // Si hay pago en efectivo, lo agrega
    if (this.valorEfectivo != null && this.valorEfectivo > 0) {
      let pagoEfectivo = {
        paymentType: "Efectivo",
        valuePaid: this.valorEfectivo,
        requiresCashDrawer: true
      }

      pagosRecibo.push(pagoEfectivo);

      // Registra la entrada de efectivo para el cuadre de caja
      let operacionEfectivo = {
        usuario: this.sesionPOS.usuario,
        tipo: 'pago',
        valor: this.valorEfectivo,
        justificacion: justificacion,
        tipoDocumento: tipoDoc
      }

      transaccionesRegistrar.push(operacionEfectivo);

      if (this.cambioVenta > 0) {
        // Registra la salida de efectivo (por entrega de cambio) para el cuadre de caja
        let operacionCambio = {
          usuario: this.sesionPOS.usuario,
          tipo: 'cambio',
          valor: this.cambioVenta,
          justificacion: justificacion,
          tipoDocumento: tipoDoc
        }

        transaccionesRegistrar.push(operacionCambio);
      }
    }

    // Si hay pago con saldo a favor, lo agrega
    if (this.valorSaldoFavor > 0) {
      let pagoSaldo = {
        paymentType: "Otro",
        valuePaid: this.valorSaldoFavor,
        requiresCashDrawer: false
      }

      pagosRecibo.push(pagoSaldo);

      // Registra operacion de caja para pago con saldo a favor
      let operacionSaldo = {
        usuario: this.sesionPOS.usuario,
        tipo: 'otro',
        valor: this.valorSaldoFavor,
        justificacion: justificacion,
        tipoDocumento: tipoDoc
      }

      transaccionesRegistrar.push(operacionSaldo);
    }

    // Agrega los pagos realizados con tarjeta
    for (let i = 0; i < this.pagosTarjeta.length; i++) {
      if (this.pagosTarjeta[i] !== null && this.pagosTarjeta[i].tipo !== null && this.pagosTarjeta[i].valor !== null && this.pagosTarjeta[i].tarjeta !== null && this.pagosTarjeta[i].voucher !== null) {
        let pagoRecibo = {
          paymentType: this.pagosTarjeta[i].franquicia,
          valuePaid: this.pagosTarjeta[i].valor,
          requiresCashDrawer: false
        }

        pagosRecibo.push(pagoRecibo);

        // Agrega el registro de pago con tarjeta
        let operacionTarjeta = {
          usuario: this.sesionPOS.usuario,
          tipo: 'tarjeta',
          valor: this.pagosTarjeta[i].valor,
          justificacion: justificacion,
          tipoDocumento: tipoDoc
        }

        transaccionesRegistrar.push(operacionTarjeta);
      }
    }

    let operaciones = {
      pagos: pagosRecibo,
      transaccionesRegistrar: transaccionesRegistrar
    }

    console.log(operaciones);
    return operaciones;
  }

  private cargarTiposEmpaque() {
    console.log('Obteniendo empaques de venta');
    this.empaques = new Array<any>();

    this._posService.obtenerEmpaqueVenta(this.sesionPOS.almacen).subscribe(
      response => {
        console.log('Empaques de venta obtenidos');
        console.log(response);
        this.empaques = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  public validarTipoEmpaque(providerCode, stringToLook) {
    if (providerCode.indexOf(stringToLook) === 0) {
      return true;
    } else {
      return false;
    }
  }

  public agregarEmpaque(itemCode) {
    for (let i = 0; i < this.empaques.length; i++) {
      if (this.empaques[i].itemCode === itemCode) {
        this.empaques[i].quantity++;
        break;
      }
    }
  }

  public eliminarEmpaque(itemCode) {
    for (let i = 0; i < this.empaques.length; i++) {
      if (this.empaques[i].itemCode === itemCode && this.empaques[i].quantity > 0) {
        this.empaques[i].quantity--;
        break;
      }
    }
  }

  public crearRegistroEmpaqueVenta() {
    let referenciasEmpaque = new Array<any>();

    for (let i = 0; i < this.empaques.length; i++) {
      if (this.empaques[i].quantity > 0) {
        let detalleEmpaque = {
          referencia: this.empaques[i].itemCode,
          cantidad: this.empaques[i].quantity
        }

        referenciasEmpaque.push(detalleEmpaque);
      }
    }

    let empaqueVenta = {
      usuario: this.sesionPOS.usuario,
      numeroFactura: this.resultadoFactura.numeroFactura,
      almacen: this.sesionPOS.almacen,
      cuenta: this.sesionPOS.cuentaEfectivo,
      referencias: referenciasEmpaque
    }

    this._posService.registrarEmpaqueVenta(empaqueVenta).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
    this.limpiarDatosFactura();
  }

  public suspenderVenta() {
    this.mensajeError = '';
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
        this.mensajeError = 'No se encontró el nit del cliente';
        this.abrirModalError();
      }
    } else {
      this.mensajeError = 'No se puede suspender la venta debido a que no ha seleccionado items';
    }
  }

  public listarVentasPendientes() {
    this._posService.listarVentasPendientes(this.sesionPOS.idTurnoCaja).subscribe(
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

  public listarVentasAnular() {
    this.facturasAnulables = new Array<any>();

    this._posService.listarFacturasAnular(this.sesionPOS.idTurnoCaja).subscribe(
      response => {
        this.facturasAnulables = response.facturas;

        if (this.facturasAnulables.length > 0) {
          $('#modalFacturasAnular').modal('show');
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public seleccionarFacturaAnular(factura: any) {
    this.facturaAnularSeleccionada = factura;
    console.log('Se selecciono la fv ' + factura.numeroFactura + ', para anular');
  }

  private anularFV() {
    $('#modalEspera').modal('show');

    this._posService.anularFV(this.sesionPOS.usuario, this.facturaAnularSeleccionada).subscribe(
      response => {
        if (response) {
          let datosNotaCredito = response;

          if (datosNotaCredito.codigo === '0') {
            // Consulta las transacciones de caja para la factura y agrega registros opuestos equivalentes para anularlos
            this._posService.consultartransacciones(this.facturaAnularSeleccionada).subscribe(
              response2 => {
                let transacciones = new Array<any>();

                for (let i = 0; i < response2.length; i++) {
                  let transaccion = {
                    usuario: this.sesionPOS.usuario,
                    tipo: response2[i].tipo,
                    valor: response2[i].valor,
                    justificacion: this.facturaAnularSeleccionada.prefijoFactura + this.facturaAnularSeleccionada.numeroFactura.substring(2),
                    anulacion: true
                  }

                  transacciones.push(transaccion);
                }

                this._posService.transacciones(transacciones).subscribe();

                // Consulta los datos de la anulacion y envia a imprimir el comprobante
                this._posService.consultarAnulacion(this.facturaAnularSeleccionada.numeroFactura, datosNotaCredito.nroNotaCredito, this.sesionPOS.nombreCaja, this.sesionPOS.usuario).subscribe(
                  response3 => {
                    if (response) {
                      this._posService.imprimir(this.sesionPOS.ip, response3).subscribe();
                    }
                  },
                  error3 => {
                    console.log(error3);
                  }
                );

                this.facturaAnularSeleccionada = null;
                $('#modalEspera').modal('hide');
              },
              error2 => {
                console.log(error2);
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

  private limpiar() {
    this.totalCaja = 0;
    this.valorUltimoDeposito = 0;
    this.limpiarVenta();
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

  public limpiarDatosFactura() {
    this.pasoFacturacion = null;
    this.itemSeleccionado = null;
    this.comentarioFactura = null;
    this.estadoFactura = '';
    this.itemFactura = null;
    this.ubicaciones = new Array<any>();
    this.empleados = new Array<any>();
    this.sucursales = new Array<any>();
    this.empleadosSeleccionados = new Array<any>();
    this.resultadoFactura = null;

    $('#modalTerminar').modal('hide');
    $('#referencia').focus();
  }
}
