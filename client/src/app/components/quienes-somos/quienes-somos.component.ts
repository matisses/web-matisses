import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  templateUrl: 'quienes-somos.html',
  styleUrls: ['quienes-somos.component.css']
})

export class QuienesComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      $("html, body").animate({scrollTop: 0}, 1000);
    });
  }
}
