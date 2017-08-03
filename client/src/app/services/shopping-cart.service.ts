import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class ShoppingCartService {
  public url: string;
  public urlBCS: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.urlBCS = GLOBAL.urlBCS;
  }

  saveShoppingCart(shoppingCart) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.url + 'shoppingcart/guardar', JSON.stringify(shoppingCart), { headers: headers })
      .map(res => res.json());
  }
}
