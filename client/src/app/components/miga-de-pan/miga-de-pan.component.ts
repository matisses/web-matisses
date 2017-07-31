import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'miga-de-pan',
    templateUrl: 'miga-de-pan.html',
    styleUrls: ['miga-de-pan.component.css']
})

export class MigaDePanComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo de miga de pan';
    }

    ngOnInit() {
        console.log('inicializando componente de miga de pan');
    }
}
