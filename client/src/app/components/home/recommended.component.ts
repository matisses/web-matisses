import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'recommended',
    templateUrl: '../../views/recommended.html',
    styleUrls: ['../../../assets/css/recommended.component.css']
})

export class RecommendedComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Articulos recomendados';
    }

    ngOnInit() {
        console.log('inicializando componente de recomendados');
    }
}
