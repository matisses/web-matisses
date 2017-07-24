import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'newsletter',
    templateUrl: 'newsletter.html',
    styleUrls: ['newsletter.component.css']
})

export class NewsletterComponent implements OnInit {
  public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el newsletter';
    }

    ngOnInit() {
        console.log('inicializando componente del newsletter');
    }
}
