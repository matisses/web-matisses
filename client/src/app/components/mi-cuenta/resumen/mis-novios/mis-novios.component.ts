import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'matisses-novios',
  templateUrl: 'mis-novios.html',
  styleUrls: ['mis-novios.component.css'],
})


export class NoviosComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
      this.title = 'Este es el cuerpo de novios';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      $("html, body").animate({scrollTop: 0}, 1000);
    });
  }

}
