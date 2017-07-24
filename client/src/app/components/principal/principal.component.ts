import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
    selector: 'principal',
    templateUrl: 'home-principal.html',
    styleUrls: ['principal.component.css']
})

export class HomePrincipalComponent implements OnInit {


    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
        console.log('inicializando componente del banner ppal ');
    }

    public botonOne() {
      console.log('has dado click al botón');
      $('body').animate({scrollTop : '600' }, 500);
      return false;
    }

}
