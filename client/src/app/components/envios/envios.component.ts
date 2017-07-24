import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    templateUrl: 'envios.html',
    styleUrls: ['envios.component.css']
})

export class EnviosComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo de envios';
    }

    ngOnInit() {
        console.log('inicializando componente de envios');
    }
}
