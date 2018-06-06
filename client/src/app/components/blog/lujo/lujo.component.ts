import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    selector: 'lujo-clasico',
    templateUrl: 'lujo.html',
    styleUrls: ['lujo.component.css']
})

export class BlogLujoComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

}
