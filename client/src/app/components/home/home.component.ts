import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  selector: 'matisses-home',
  templateUrl: 'home.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      $("html, body").animate({scrollTop: 0}, 1000);
    });
  }

}
