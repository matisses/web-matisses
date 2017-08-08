import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Item } from '../models/item';

@Injectable()
export class ItemService {
  public url: string;
  private wishlist: Array<Item>;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.wishlist = new Array<Item>();
  }

  listNewItems() {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.url + 'item/nuevos/', { headers: headers })
      .map(res => res.json());
  }

  filter(queryString) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + 'item/filtrar' + queryString, { headers: headers })
      .map(res => res.json());
  }

  updateFilters(queryString) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + 'item/consultarfiltros' + queryString, { headers: headers })
      .map(res => res.json());
  }

  findType(type, queryString) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + 'item/consultar' + type + queryString, { headers: headers })
      .map(res => res.json());
  }

  find(itemCode: string) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + 'item/consultaritem/' + itemCode, { headers: headers })
      .map(res => res.json());
  }

  public inicializarWishlist() {
    this.wishlist = JSON.parse(localStorage.getItem('matisses.wishlist'));
    if (this.wishlist === null || typeof this.wishlist === 'undefined') {
      this.wishlist = new Array<Item>();
    }
  }

  public toggleWishList(item: Item) {
    this.inicializarWishlist();
    if (this.isInWishlist(item)) {
      //el item ya esta en el wishlist, eliminarlo
      for (let i = 0; i < this.wishlist.length; i++) {
        if (this.wishlist[i].itemcode === item.itemcode) {
          this.wishlist.splice(i, 1);
          break;
        }
      }
    } else {
      //el item no esta en el wishlist, agregarlo
      this.wishlist.push(item);
    }
    localStorage.setItem('matisses.wishlist', JSON.stringify(this.wishlist));
  }

  public isInWishlist(item: Item) {
    for (let j = 0; j < this.wishlist.length; j++) {
      if (this.wishlist[j].itemcode === item.itemcode) {
        //el item ya esta en la lista de deseos
        return true;
      }
    }
    return false;
  }

  public getCSSClassName(item: Item) {
    if (this.isInWishlist(item)) {
      return 'glyphicon-heart';
    }
    return 'glyphicon-heart-empty';
  }

  public findRelatedItems(model: string) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.url + 'item/obtenerrelacionados/' + model, { headers: headers })
      .map(res => res.json());
  }
}
