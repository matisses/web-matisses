import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class StockService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getStock(itemcode: string) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + 'stock/consultarstock/' + itemcode, { headers: headers })
      .map(res => res.json());
  }
}
