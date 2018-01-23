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


}
