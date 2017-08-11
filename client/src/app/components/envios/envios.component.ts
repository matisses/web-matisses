import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'envios.html',
    styleUrls: ['envios.component.css']
})

export class EnviosComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo de envios';
    }

    ngOnInit() {
        //console.log('inicializando componente de envios');
    }

    ngAfterViewInit() {
      console.log('Termino de cargar deberia subir el body')
      $(document).ready(function() {
        $("html, body").animate({scrollTop: 0}, 1000);
      });
    }
}
