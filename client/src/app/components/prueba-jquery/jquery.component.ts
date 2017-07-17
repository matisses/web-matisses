import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'jquery-component',
  templateUrl: '../../views/jquery-view.html',
  styleUrls: ['../../../assets/css/jquery-style.component.css']
})

export class JqueryComponent implements OnInit {
  title = 'Prueba de jquery en angular';

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    console.log('inicializando componente de jquery');
  }

  public toggleTitle() {
    console.log('has dado click al botón');
    $('.title').slideToggle();
  }

  public botonRight() {
    console.log('has dado click al botón right');
    $('.scrollmenu').animate({scrollLeft : '+=80'}, 500);
    return false;
  }

  public botonLeft() {
    console.log('has dado click al botón right');
    $('.scrollmenu').animate({scrollLeft : '-=80'}, 500);
    return false;
  }

}
