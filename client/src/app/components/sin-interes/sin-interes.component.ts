import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'sin-interes.html',
    styleUrls: ['sin-interes.component.css']
})

export class SinInteresComponent implements OnInit {

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
      $(document).ready(function() {
        $("html, body").animate({scrollTop: 0}, 1000);
      });
    }

}
