import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'resumen.html',
  styleUrls: ['resumen.component.css'],
})


export class ResumenMiCuentaComponent implements OnInit {
  public paso: number = 3;

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    if(localStorage.getItem('matisses.session-token')==null){
      console.log('no hay session');
      this._router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    if(localStorage.getItem('matisses.session-token')==null){
      console.log('no hay session');
      this._router.navigate(['/login']);
    }
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

  public irPaso(paso) {
    this.paso = paso;
  }

}
