import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'new-products',
    templateUrl: '../../views/newproducts.html',
    styleUrls: ['../../../assets/css/newproducts.component.css']
})

export class NewProductsComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Nuevos productos';
    }

    ngOnInit() {
        console.log('inicializando componente de nuevos productos');
    }
}
