import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  selector: 'blog-ocasionales',
  templateUrl: 'ocasionales.html',
  styleUrls: ['ocasionales.component.css']
})

export class BlogOcasionalesComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

}
