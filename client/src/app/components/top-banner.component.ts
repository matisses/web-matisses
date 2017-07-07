import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'top-banner',
    templateUrl: '../views/top-banner.html',
    styleUrls: ['../../assets/css/top-banner.component.css']
})

export class TopBannerComponent implements OnInit {


    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
        console.log('inicializando componente de banner superior');
    }
}
