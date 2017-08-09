import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    templateUrl: 'quienes-somos.html',
    styleUrls: ['quienes-somos.component.css']
})

export class QuienesComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo de quienes somos';
    }

    ngOnInit() {
        //console.log('inicializando componente de quienes somos');
    }
}
