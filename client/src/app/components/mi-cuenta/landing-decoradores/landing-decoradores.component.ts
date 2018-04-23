import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'landing-decoradores.html',
  styleUrls: ['landing-decoradores.component.css'],
})


export class LandingDecoradoresComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo de decoradores';
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    })
  }

  irALogin(){
    console.log('irALogin');
    localStorage.setItem('decorator_register','Y');
      this._router.navigate(['/login']);
  }

}
