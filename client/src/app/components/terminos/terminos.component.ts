import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'terminos.html',
    styleUrls: ['terminos.component.css']
})

export class TerminosComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el cuerpo de terminos';
    }

    ngOnInit() {
        //console.log('inicializando componente de garantias');
    }

    ngAfterViewInit() {
      console.log('Termino de cargar deberia subir el body')
      $(document).ready(function() {
        $("html, body").animate({scrollTop: 0}, 1000);
      });
    }

}
