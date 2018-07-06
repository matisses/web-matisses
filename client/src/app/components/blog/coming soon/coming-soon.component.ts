import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    selector: 'coming-soon',
    templateUrl: 'coming-soon.html',
    styleUrls: ['coming-soon.component.css']
})

export class BlogComingSoonComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

}
