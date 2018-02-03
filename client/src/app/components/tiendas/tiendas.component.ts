import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'tiendas.html',
    styleUrls: ['tiendas.component.css']
})

export class TiendasComponent implements OnInit {
    public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {
      $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll > 1) {
          $(".leer-mas").addClass("show");
        } else {
          $(".leer-mas").removeClass("show")
        }
      });

      $(".leer-mas").click(function() {
        $("html, body").animate({scrollTop: 500}, 1000);
      });
    }

    ngAfterViewInit() {
      $(document).ready(function() {
        $("html, body").animate({scrollTop: 0}, 1000);
      });
    }

}
