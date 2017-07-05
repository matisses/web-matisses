import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'discounts',
    templateUrl: '../../views/discounts.html',
    styleUrls: ['../../../assets/css/discounts.component.css']
})

export class DiscountsComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Productos en promocion';
    }

    ngOnInit() {
        console.log('inicializando componente de productos en promocion ');
    }
}
