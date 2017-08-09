import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'tiendas.html',
    styleUrls: ['tiendas.component.css']
})

export class TiendasComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
        console.log('inicializando componente de tiendas');
    }

    ngAfterViewInit() {
      console.log('Termino de cargar deberia subir el body')
      $(document).ready(function() {
        $("html, body").animate({scrollTop: 0}, 1000);
      });
    }

}
