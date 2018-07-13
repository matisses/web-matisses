import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    selector: 'aparadores',
    templateUrl: 'aparadores.html',
    styleUrls: ['aparadores.component.css']
})

export class BlogAparadoresComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

}
