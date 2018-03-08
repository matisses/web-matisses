import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'resumen.html',
  styleUrls: ['resumen.component.css'],
})


export class ResumenMiCuentaComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
      this.title = 'Este es el cuerpo de resumen';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      $("html, body").animate({scrollTop: 0}, 1000);
    });
  }

}
