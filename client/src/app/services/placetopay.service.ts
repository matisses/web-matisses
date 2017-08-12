import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class PlacetoPayService {
  public url: string;
  public urlBCS: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.urlBCS = GLOBAL.urlBCS;
  }

  redirect(datosPago) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'placetopay/redirect', JSON.stringify(datosPago), { headers: headers })
      .map(res => res.json());
  }

  consultar(datosCompraWeb) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'placetopay/consultar', JSON.stringify(datosCompraWeb), { headers: headers })
      .map(res => res.json());
  }
}
