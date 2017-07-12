import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'best-seller',
    templateUrl: '../../views/best-seller.html',
    styleUrls: ['../../../assets/css/best-seller.component.css']
})

export class BestSellerComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Best Seller';
    }

    ngOnInit() {
        console.log('inicializando componente de best seller ');
    }
}
