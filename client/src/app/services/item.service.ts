import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Item } from '../models/item';

@Injectable()
export class ItemService {
  public url: string;
  public urlBCS: string;
  private wishlist: Array<Item>;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.urlBCS = GLOBAL.urlBCS;
    this.wishlist = new Array<Item>();
  }

  public listNewItems() {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.url + 'item/nuevos/', { headers: headers })
      .map(res => res.json());
  }

  public filter(queryString) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + 'item/filtrar' + queryString, { headers: headers })
      .map(res => res.json());
  }

  public updateFilters(queryString) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + 'item/consultarfiltros' + queryString, { headers: headers })
      .map(res => res.json());
  }

  public findType(type, queryString) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + 'item/consultar' + type + queryString, { headers: headers })
      .map(res => res.json());
  }

  public find(itemCode: string) {
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

  public validarItems(items) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.urlBCS + 'validarinventario/validar', JSON.stringify(items), { headers: headers })
      .map(res => res.json());
  }

  public listBrands() {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.url + 'item/listarmarcasvajilla', { headers: headers })
      .map(res => res.json());
  }

  public listCollections(brand) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this._http.get(this.url + 'item/listarcolecciones/' + brand, { headers: headers })
      .map(res => res.json());
  }
}
