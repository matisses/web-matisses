import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'category-matisses',
    templateUrl: 'category.html',
    styleUrls: ['category.component.css']
})

export class CategoryComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo';
    }

    ngOnInit() {
        console.log('inicializando componente de categoria');
    }
}
