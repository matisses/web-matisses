import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'chat',
    templateUrl: 'chat.html',
    styleUrls: ['chat.component.css']
})

export class ChatComponent implements OnInit {
  public title: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.title = 'Este es el chat';
    }

    ngOnInit() {
        
    }
}
