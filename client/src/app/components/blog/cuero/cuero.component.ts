import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    selector: 'cuero',
    templateUrl: 'cuero.html',
    styleUrls: ['cuero.component.css']
})

export class BlogCueroComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

}
