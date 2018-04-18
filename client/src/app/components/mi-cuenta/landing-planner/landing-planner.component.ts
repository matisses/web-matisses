import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'landing-planner.html',
  styleUrls: ['landing-planner.component.css'],
})


export class LandingPlannerComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo de planners';
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    })
  }

}