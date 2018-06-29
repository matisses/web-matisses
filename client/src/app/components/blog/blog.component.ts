import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'blog.html',
    styleUrls: ['blog.component.css']
})

export class BlogComponent implements OnInit {
    public title: string;
    public blogNumber: number = 6;

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
      $(document).ready(function() {
        $("html, body").animate({scrollTop: 0}, 1000);
      });
      
    }
  
    public seleccionarBlog(id) {
      this.blogNumber = id;
    }

}
