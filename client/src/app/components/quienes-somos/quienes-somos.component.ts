import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  templateUrl: 'quienes-somos.html',
  styleUrls: ['quienes-somos.component.css']
})

export class QuienesComponent implements OnInit {
  //public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    //this.title = 'Este es el cuerpo de quienes somos';
  }

  ngOnInit() {
    //console.log('inicializando componente de quienes somos');
  }

  ngAfterViewInit() {
    //console.log('Termino de cargar deberia subir el body')
    $(document).ready(function() {
      $("html, body").animate({scrollTop: 0}, 1000);
    });
  }
}
