import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    templateUrl: 'garantias.html',
    styleUrls: ['garantias.component.css']
})

export class GarantiasComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo de garantias';
    }

    ngOnInit() {
        console.log('inicializando componente de garantias');
    }
}
