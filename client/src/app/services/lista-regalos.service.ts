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

    return this._http.post(this.urlBCS + 'listaregalos/crear/', JSON.stringify(datosLista), { headers: headers })
      .map(res => res.json());
  }

  consultarLista(datosConsulta) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'listaregalos/consultarlistas/', JSON.stringify(datosConsulta), { headers: headers })
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


}