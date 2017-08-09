import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'matisses-header',
    templateUrl: 'header.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit {

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {
        //console.log('inicializando componente de encabezado');
    }
}
