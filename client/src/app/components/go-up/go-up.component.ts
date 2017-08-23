import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  selector: 'go-up',
  templateUrl: 'go-up.html',
  styleUrls: ['go-up.component.css']
})

export class GoUpComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 300) {
        $(".goup").addClass("show");
      } else {
        $(".goup").removeClass("show")
      }
    });

    $(".goup").click(function() {
      $("html, body").animate({scrollTop: 0}, 500);
    });

  }
}
