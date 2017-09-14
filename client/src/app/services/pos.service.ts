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
}
