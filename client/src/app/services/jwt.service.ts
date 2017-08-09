import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class JWTService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  validateToken(token: string) {
    return this._http.get(GLOBAL.urlBCS + 'jwt/validate/' + token)
      .map(res => res.json());
  }
}
