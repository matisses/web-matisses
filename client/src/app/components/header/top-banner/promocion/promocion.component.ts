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
    $(document).ready(function() {
      $('#countdown_dashboard').countDown({
        targetDate: {
          'day': 16,
          'month': 11,
          'year': 2017,
          'hour': 0,
          'min': 0,
          'sec': 0
        }
      });
    });

    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 5) {
        $(".promocion").addClass("none");
      } else {
        $(".promocion").removeClass("none")
      }
    });
  }
}
