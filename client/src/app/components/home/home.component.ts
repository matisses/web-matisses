import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'matisses-home',
    templateUrl: '../../views/home.html',
    styleUrls: ['../../../assets/css/home.component.css']
})

export class HomeComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo';
    }

    ngOnInit() {
        console.log('inicializando componente de cuerpo');
    }
}
