import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'matisses-footer',
    templateUrl: 'footer.html',
    styleUrls: ['footer.component.css']
})

export class FooterComponent implements OnInit {
  public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el footer';
    }

    ngOnInit() {
        //console.log('inicializando componente del footer');
    }
}
