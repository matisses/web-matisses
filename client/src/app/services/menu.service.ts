import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class MenuItemService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  list(parentId) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    if (parentId != null) {
      return this._http.get(this.url + 'menuitem/list/' + parentId, { headers: headers })
        .map(res => res.json());
    } else {
      return this._http.get(this.url + 'menuitem/list/', { headers: headers })
        .map(res => res.json());
    }
  }

  edit(menuItem) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + 'menuitem/edit', JSON.stringify(menuItem), { headers: headers })
      .map(res => res.json());
  }

  save(menuItem) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + 'menuitem/save', JSON.stringify(menuItem), { headers: headers })
      .map(res => res.json());
  }

  remove(idMenuItem) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.delete(this.url + 'menuitem/remove/' + idMenuItem, { headers: headers })
      .map(res => res.json());
  }

  listMenuRecursively(id, token) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    if(id == null){
      return this._http.get(this.url + 'menuitem/recursive', { headers: headers })
        .map(res => res.json());
    } else {
      return this._http.get(this.url + 'menuitem/recursive/' + id, { headers: headers })
        .map(res => res.json());
    }
  }
}
