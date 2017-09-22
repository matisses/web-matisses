import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class PosService {
  public urlBCS: string;

  constructor(private _http: Http) {
    this.urlBCS = GLOBAL.urlBCS;
  }

  validarSesion(token) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'session/' + token, { headers: headers })
      .map(res => res.json());
  }

  validarPermisos(validarPermisos) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'session/validar/', JSON.stringify(validarPermisos), { headers: headers })
      .map(res => res.json());
  }

  abrirCaja(transaccion) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'caja/transaccion/', JSON.stringify(transaccion), { headers: headers })
      .map(res => res.json());
  }

  transacciones(transacciones) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'caja/transacciones/', JSON.stringify(transacciones), { headers: headers })
      .map(res => res.json());
  }

  obtenerSaldo(usuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'caja/saldo', JSON.stringify(usuario), { headers: headers })
      .map(res => res.json());
  }

  consultartransacciones(facturaAnular) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'caja/consultartransacciones/', JSON.stringify(facturaAnular), { headers: headers })
      .map(res => res.json());
  }

  obtenerValorApertura(idTurnoCaja) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'caja/valorapertura/' + idTurnoCaja, { headers: headers })
      .map(res => res.json());
  }

  consultarDatosTirillaZ(usuario, idTurnoCaja) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'caja/generarZ/' + usuario + '/' + idTurnoCaja, { headers: headers })
      .map(res => res.json());
  }

  obtenerFranquicias(almacen) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'tarjetacredito/' + almacen, { headers: headers })
      .map(res => res.json());
  }

  agregarReferencia(referencia, almacen) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'iteminventario/consulta/' + referencia + '/' + almacen, { headers: headers })
      .map(res => res.json());
  }

  obtenerDescuento(referencia) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'consultaproductos/descuento/PO/' + referencia, { headers: headers })
      .map(res => res.json());
  }

  suspenderVenta(datosVenta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'ventapos/guardar/', JSON.stringify(datosVenta), { headers: headers })
      .map(res => res.json());
  }

  listarVentasPendientes(idTurnoCaja) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'ventapos/pendientes/' + idTurnoCaja, { headers: headers })
      .map(res => res.json());
  }

  consultarVentaPendiente(idVentaPendiente) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'ventapos/pendientes/productos/' + idVentaPendiente, { headers: headers })
      .map(res => res.json());
  }

  facturar(venta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'ventapos/facturar/', JSON.stringify(venta), { headers: headers })
      .map(res => res.json());
  }

  venderTarjetaRagalo(venta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'ventapos/venderTarjetaRegalo/', JSON.stringify(venta), { headers: headers })
      .map(res => res.json());
  }

  consultarDatosCliente(nit) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sociodenegocios/' + nit, { headers: headers })
      .map(res => res.json());
  }

  consultarSaldoFavorCliente(nit) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sociodenegocios/saldo/' + nit, { headers: headers })
      .map(res => res.json());
  }

  obtenerStockItem(almacen: string, items) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'iteminventario/consultastock/' + almacen, JSON.stringify(items), { headers: headers })
      .map(res => res.json());
  }

  listarEmpleados() {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'empleado/list', { headers: headers })
      .map(res => res.json());
  }

  obtenerEmpaqueVenta(almacen) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'empaqueventa/list/' + almacen, { headers: headers })
      .map(res => res.json());
  }

  registrarEmpaqueVenta(empaqueVenta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'empaqueventa', JSON.stringify(empaqueVenta), { headers: headers })
      .map(res => res.json());
  }

  imprimirRecibo(ip: string, invoiceData) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post('http://' + ip + ':8008/print/', JSON.stringify(invoiceData), { headers: headers })
      .map(res => res.json());
  }

  imprimirReciboCaja(ip: string, receiptData) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post('http://' + ip + ':8008/printReciboCaja/', JSON.stringify(receiptData), { headers: headers })
      .map(res => res.json());
  }

  imprimir(ip: string, receiptData) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post('http://' + ip + ':8008/void/', JSON.stringify(receiptData), { headers: headers })
      .map(res => res.json());
  }

  imprimirZ(ip: string, receiptData) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post('http://' + ip + ':8008/printZ/', JSON.stringify(receiptData), { headers: headers })
      .map(res => res.json());
  }

  abrirCajon(ip: string) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get('http://' + ip + ':8008/open/', { headers: headers })
      .map(res => res.json());
  }

  listarFacturasAnular(idTurnoCaja) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'factura/anular/lista/' + idTurnoCaja, { headers: headers })
      .map(res => res.json());
  }

  consultarAnulacion(numeroFactura, numeroNotaCredito, nombreCaja, usuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'factura/consulta/anulacion/' + numeroFactura + '/' + numeroNotaCredito + '/' + nombreCaja + '/' + usuario, { headers: headers })
      .map(res => res.json());
  }

  consultarDatosCierreCaja(almacen, idTurnoCaja) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'factura/consultarDatosCierre/' + almacen + '/' + idTurnoCaja, { headers: headers })
      .map(res => res.json());
  }

  anularFV(usuario, facturaAnular) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'notacredito/anular/' + usuario, JSON.stringify(facturaAnular), { headers: headers })
      .map(res => res.json());
  }
}
