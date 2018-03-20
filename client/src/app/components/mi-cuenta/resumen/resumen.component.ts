import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'resumen.html',
  styleUrls: ['resumen.component.css'],
})


export class ResumenMiCuentaComponent implements OnInit {
  public paso: number = 1;
  public decorador: boolean = false;
  public planner: boolean = true;
  public menuMobile: boolean = false;
  private viewportWidth: number = 0;

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
    this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (this.viewportWidth <= 640) {
      this.showMenuMobile();
    } else {
    }
  }

  public showMenuMobile() {
    if (this.viewportWidth <= 640) {
      this.menuMobile = true
    } else { }
  }

  public irPaso(paso) {
    this.paso = paso;
  }

  public toggleClass(idComponent, class1, class2) {
    $(idComponent).toggleClass(class1 + " " + class2);
  }

  public scrollTop(id) {
    if (id < 2) {
      $("html, body").animate({ scrollTop: 35 }, 500);
      console.log(id);
    } else if (id < 3) {
      $("html, body").animate({ scrollTop: 80 }, 500);
      console.log(id);
    } else if (id < 4) {
      $("html, body").animate({ scrollTop: 125 }, 500);
      console.log(id);
    } else if (id < 5) {
      $("html, body").animate({ scrollTop: 170 }, 500);
      console.log(id);
    } else { }
  }

}
