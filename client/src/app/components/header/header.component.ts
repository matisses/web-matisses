import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'matisses-header',
    templateUrl: 'header.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el encabezado';
    }

    ngOnInit() {
        console.log('inicializando componente de encabezado');
    }
}
