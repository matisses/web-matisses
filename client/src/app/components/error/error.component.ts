import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    templateUrl: 'error.html',
    styleUrls: ['error.component.css']
})

export class ErrorComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
    }
}
