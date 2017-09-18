import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class CrockeryService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  public create(vajilla) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.url + 'crockery/', vajilla, { headers: headers })
      .map(res => res.json());
  }

  public remove(id_vajilla) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.delete(this.url + 'crockery/remove/' + id_vajilla, { headers: headers })
      .map(res => res.json());
  }

  public list() {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.url + 'crockery/', { headers: headers })
      .map(res => res.json());
  }

  public listItems(id_vajilla) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.url + 'crockery/items/' + id_vajilla, { headers: headers })
      .map(res => res.json());
  }
}
