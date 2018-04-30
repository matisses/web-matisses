import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class DigitoVerificacionService {
    public urlBCS: string;

    constructor(private _http: Http) {
        this.urlBCS = GLOBAL.urlBCS;
    }

    consultarDigitoVerificacion(nit: string) {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this._http.get(this.urlBCS + "digitoverificacion/consultar/" + nit, { headers: headers })
            .map(res => res.json());
    }
}