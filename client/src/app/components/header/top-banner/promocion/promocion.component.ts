import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  selector: 'promocion',
  templateUrl: 'promocion.html',
  styleUrls: ['promocion.component.css']
})

export class PromocionComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();
      if (scroll >= 5) {
        $(".promocion").addClass("none");
      } else {
        $(".promocion").removeClass("none")
      }
    });
  }
}
