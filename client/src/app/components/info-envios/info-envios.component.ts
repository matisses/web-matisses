import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'info-envios.html',
    styleUrls: ['info-envios.component.css']
})

export class InfoEnviosComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo de info-envios';
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
      $(document).ready(function() {
        $("html, body").animate({scrollTop: 0}, 1000);
      });
    }
}
