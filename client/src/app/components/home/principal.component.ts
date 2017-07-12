import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
    selector: 'principal',
    templateUrl: '../../views/home-principal.html',
    styleUrls: ['../../../assets/css/principal.component.css']
})

export class HomePrincipalComponent implements OnInit {


    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
        console.log('inicializando componente del banner ppal ');
    }
}
