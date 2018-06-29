import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    selector: 'espejos',
    templateUrl: 'espejos.html',
    styleUrls: ['espejos.component.css']
})

export class BlogEspejosComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

}
