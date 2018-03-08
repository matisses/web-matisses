import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  selector: 'matisses-signIn',
  templateUrl: 'sign-in.html',
  styleUrls: ['sign-in.component.css']
})

export class SignInComponent implements OnInit {
  public title: string;


  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo de Sign In';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
