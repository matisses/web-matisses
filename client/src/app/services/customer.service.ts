import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class CustomerService {
  public url: string;
  public urlBCS: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.urlBCS = GLOBAL.urlBCS;
  }

  getCustomerData(cardCode) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.urlBCS + 'businesspartner/' + cardCode, { headers: headers })
      .map(res => res.json());
  }
}
