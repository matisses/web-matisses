import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'info-bogota.html',
  styleUrls: ['info-bogota.component.css'],
})

export class InfoBogotaComponent implements OnInit {


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
      $("html, body").animate({scrollTop: 900}, 500);
    });
  }
}
