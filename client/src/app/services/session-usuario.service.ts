import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class SessionUsuarioService {
  public url: string;
  public urlBCS: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.urlBCS = GLOBAL.urlBCS;
  }

  login(datosUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'sessionusuario/login', JSON.stringify(datosUsuario), { headers: headers })
      .map(res => res.json());
  }

  updateUser(datosUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'sessionusuario/updatepass', JSON.stringify(datosUsuario), { headers: headers })
      .map(res => res.json());
  }

  createUser(datosUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'sessionusuario/crear/', JSON.stringify(datosUsuario), { headers: headers })
      .map(res => res.json());
  }

  validarUsuario(nombreUsuario, documento) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/consultarusuariopagina/' + nombreUsuario + '/' + documento, { headers: headers })
      .map(res => res.json());
  }

  recuperarClave(nombreUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/recuperar/' + nombreUsuario, { headers: headers })
      .map(res => res.json());
  }

  cargarcliente(nombreUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/cargarcliente/' + nombreUsuario, { headers: headers })
      .map(res => res.json());
  }

  editarCliente(datosCliente) {
    console.log('entra en el servicio de editar');
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'sessionusuario/editar/', JSON.stringify(datosCliente), { headers: headers })
      .map(res => res.json());
  }

  verPedidos(documentoUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/mispedidos/' + documentoUsuario, { headers: headers })
      .map(res => res.json());
  }

  detallePedido(numeroFactura) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/detallepedido/' + numeroFactura, { headers: headers })
      .map(res => res.json());
  }

  misNovios(documentoUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/misnovios/' + documentoUsuario, { headers: headers })
      .map(res => res.json());
  }

  updatePassword(datosUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'sessionusuario/updateclave', JSON.stringify(datosUsuario), { headers: headers })
      .map(res => res.json());
  }

  subirImagen(formData) {
    const headers = new Headers({
      'Content-Type': 'multipart/form-data; boundary = ---- WebKitFormBoundary7MA4YWxkTrZu0gW'
    });

    return this._http.post(this.urlBCS + 'sessionusuario/subirimagen/', formData)
      .map(res => res);
  }

  verNoviosWP(documento) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/misnovios/' + documento, { headers: headers })
      .map(res => res.json());
  }

  totalAcumuladoWP(documentoUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/cargarmontoacumulado/' + documentoUsuario, { headers: headers })
      .map(res => res.json());
  }

  materialPorItem(itemcode) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/cargarmateriales/' + itemcode, { headers: headers })
      .map(res => res.json());
  }

  averiasPorMaterial(materialcode) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/cargaraverias/' + materialcode, { headers: headers })
      .map(res => res.json());
  }

  llamadaServicio(datosLlamada) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'sessionusuario/reclamargarantia', JSON.stringify(datosLlamada), { headers: headers })
      .map(res => res.json());
  }

  confirmarUsuario(nombreUsuario) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/activarusuario/' + nombreUsuario, { headers: headers })
      .map(res => res.json());
  }

  solicitarRedencion(datosLlamada) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'sessionusuario/solicitaredencion', JSON.stringify(datosLlamada), { headers: headers })
      .map(res => res.json());
  }

  documentosRedencion(formData) {
    const headers = new Headers({
      'Content-Type': 'multipart/form-data; boundary = ---- WebKitFormBoundary7MA4YWxkTrZu0gW'
    });

    return this._http.post(this.urlBCS + 'sessionusuario/subirredencion/', formData)
      .map(res => res);
  }
  misClientes(documento) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/cargar-clientes-decorador/' + documento, { headers: headers })
      .map(res => res.json());
  }


  facturasClienteDecorador(documentoDecorador, documentoCliente) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/cargar-facturas-clientes-decorador/' + documentoDecorador + '/' + documentoCliente, { headers: headers })
      .map(res => res.json());
  }

  actualizarAceptoClausulaDecorador(documentoDecorador, acepto) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/updateaceptacionclausula/' + documentoDecorador + '/' + acepto, { headers: headers })
      .map(res => res.json());
  }
}