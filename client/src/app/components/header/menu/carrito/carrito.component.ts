import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'matisses-carrito',
  templateUrl: 'carrito.html',
  styleUrls: ['../menu.component.css']
})

export class CarritoComponent implements OnInit {
  public items: number = 34;

  constructor(private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    console.log('inicializando componente de carrito');
  }

}
