import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  selector: 'blog-cubiertos',
  templateUrl: 'cubiertos.html',
  styleUrls: ['cubiertos.component.css']
})

export class BlogCubiertosComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

}
