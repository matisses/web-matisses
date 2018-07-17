import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';

declare var $: any;

@Component({
  templateUrl: 'confirmacion-decorador.html',
  styleUrls: ['confirmacion-decorador.component.css'],
  providers: []
})

export class ConfirmDecoComponent implements OnInit {
  public title: string;
  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el modulo de confirmación de decorador';

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

}
