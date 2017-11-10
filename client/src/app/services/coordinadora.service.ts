import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class CoordinadoraService {
  public urlBCS: string;

  constructor(private _http: Http) {
    this.urlBCS = GLOBAL.urlBCS;
  }

  crearCotizacionEnvio(datosCompra: any) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'coordinadora/quotation', JSON.stringify(datosCompra), { headers: headers })
      .map(res => res.json());
  }
}
