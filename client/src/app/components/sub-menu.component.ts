import { Component, Input, OnInit } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'show-more',
  templateUrl: '../views/menu.html',
  animations: [
    trigger('visibility', [
      state('inactive', style({
        display: 'none'
      })),
      state('active',   style({
        display: 'block',
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class ShowMoreComponent implements OnInit {
  ngOnInit() {
      console.log('inicializando componente de animacion menú');
  }
}
