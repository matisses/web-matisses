import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'principal',
    templateUrl: '../../views/home-principal.html',
    styleUrls: ['../../../assets/css/principal.component.css']
})

export class HomePrincipalComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Banner ppal y contenido relacionado';
    }

    ngOnInit() {
        console.log('inicializando componente del banner ppal ');
    }
}
