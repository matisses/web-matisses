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

  misNovios(documentoUsuario){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'sessionusuario/misnovios/' + documentoUsuario, { headers: headers })
      .map(res => res.json());
  }


}
