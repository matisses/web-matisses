import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class ListaRegalosService {
  public url: string;
  public urlBCS: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.urlBCS = GLOBAL.urlBCS;
  }

  crearLista(datosLista) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/crear', JSON.stringify(datosLista), { headers: headers })
      .map(res => res.json());
  }

  consultarLista(datosConsulta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.urlBCS + 'listaregalos/consultarlistas', JSON.stringify(datosConsulta), { headers: headers })
      .map(res => res.json());
  }

  consultarListaUsuario(idUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/consultarporusuario/', JSON.stringify(idUsuario), { headers: headers })
      .map(res => res.json());
  }

  modificarLista(datosLista) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/modificar/', JSON.stringify(datosLista), { headers: headers })
      .map(res => res.json());
  }

  eliminarProducto(itemcode, idLista) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'listaregalos/eliminaritemlista/' + idLista + '/' + itemcode, { headers: headers })
      .map(res => res.json());
  }

  agregarProducto(productoDTO) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/agregarproducto/', JSON.stringify(productoDTO), { headers: headers })
      .map(res => res.json());
  }

  consultarListaPaginada(paramsConsulta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/consultarproductos/', JSON.stringify(paramsConsulta), { headers: headers })
      .map(res => res.json());
  }

  consultarTotalLista(idLista) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'listaregalos/consultartotalproductos/' + idLista, { headers: headers })
      .map(res => res.json());
  }

  crearInvitado(invitadoDTO) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/crearinvitado/', JSON.stringify(invitadoDTO), { headers: headers })
      .map(res => res.json());
  }

  consultarInvitados(idLista) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'listaregalos/consultarinvitados/' + idLista, { headers: headers })
      .map(res => res.json());
  }

  actualizarConfirmarAsistencia(confirmarAsistenciaDTO) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/updateasistenciainvitado/', JSON.stringify(confirmarAsistenciaDTO), { headers: headers })
      .map(res => res.json());
  }

  generarDocumento(documento, codigoLista) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'listaregalos/generardocumento/' + documento + "/" + codigoLista, { headers: headers })
      .map(res => res.json());
  }

  consultarListaComprados(paramsConsulta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/consultarcomprados/', JSON.stringify(paramsConsulta), { headers: headers })
      .map(res => res.json());
  }

  actualizarFechaEntrega(datosConsulta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/updatefechaentrega/', JSON.stringify(datosConsulta), { headers: headers })
      .map(res => res.json());
  }

  consultarDetalleCompra(datosConsulta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/consultarcomprap/', JSON.stringify(datosConsulta), { headers: headers })
      .map(res => res.json());
  }

  modificarCantidadElegida(codigoLista, item, cantidad) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'listaregalos/modificarcantidadelegida/' + codigoLista + "/" + item + "/" + cantidad, { headers: headers })
      .map(res => res.json());
  }

  modificarMensajeAgradecimiento(listaDTO) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/modificarmsjagradecimiento/', JSON.stringify(listaDTO), { headers: headers })
      .map(res => res.json());
  }

  devolverItemsFactura(idLista, factura, salesDocumentLineDTO) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/devolucion/' + idLista + '/' + factura, JSON.stringify(salesDocumentLineDTO), { headers: headers })
      .map(res => res.json());
  }

  subirImagenLista(formData) {
    const headers = new Headers({
      'Content-Type': 'multipart/form-data; boundary = ---- WebKitFormBoundary7MA4YWxkTrZu0gW'
    });

    return this._http.post(this.urlBCS + 'listaregalos/subirimagen/', formData)
      .map(res => res);
  }

  consultarListaSinPaginar(paramsConsulta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/consultarproductos/sinpaginar/', JSON.stringify(paramsConsulta), { headers: headers })
      .map(res => res.json());
  }

  subirArchivoMasivo(formData) {
    const headers = new Headers({
      'Content-Type': 'multipart/form-data; boundary = ---- WebKitFormBoundary7MA4YWxkTrZu0gW'
    });

    return this._http.post(this.urlBCS + 'listaregalos/subirarchivo/', formData)
      .map(res => res);
  }

  recuperarClave(nombreUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/recuperar/' + nombreUsuario, { headers: headers })
      .map(res => res.json());
  }

  consultarPlanificadoresActivos() {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'listaregalos/consultarplanificadores', { headers: headers })
      .map(res => res.json());
  }

  enviarInvitacionSmsMasivo(codigoLista) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'listaregalos/enviarinvitacionsmsmasivo/' + codigoLista, { headers: headers })
      .map(res => res.json());
  }
}
