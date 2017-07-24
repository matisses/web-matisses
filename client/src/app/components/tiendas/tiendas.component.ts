import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    templateUrl: 'tiendas.html',
    styleUrls: ['tiendas.component.css']
})

export class TiendasComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
        console.log('inicializando componente de tiendas');
    }
}
