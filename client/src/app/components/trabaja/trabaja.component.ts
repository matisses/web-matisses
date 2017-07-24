import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    templateUrl: 'trabaja.html',
    styleUrls: ['trabaja.component.css']
})

export class TrabajaComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo de trabaja con nosotros';
    }

    ngOnInit() {
        console.log('inicializando componente de trabaja con nosotros');
    }
}
