import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'promocion',
    templateUrl: 'promocion.html',
    styleUrls: ['promocion.component.css']
})

export class PromocionComponent implements OnInit {
    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {
    }
}
