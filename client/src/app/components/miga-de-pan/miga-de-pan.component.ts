import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'miga-de-pan',
    templateUrl: 'miga-de-pan.html',
    styleUrls: ['miga-de-pan.component.css']
})

export class MigaDePanComponent implements OnInit {
    public nombreGrupo: string;
    public nombreSubgrupo: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {
        console.log('inicializando componente de miga de pan');
    }
}
