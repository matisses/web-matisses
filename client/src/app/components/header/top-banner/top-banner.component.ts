import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    selector: 'top-banner',
    templateUrl: 'top-banner.html',
    styleUrls: ['top-banner.component.css']
})

export class TopBannerComponent implements OnInit {
    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {
    }

}
