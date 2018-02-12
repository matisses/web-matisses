import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'tips.html',
  styleUrls: ['tips.component.css'],
})

export class TipsComponent implements OnInit {
  public tipoEvento: number = 0;

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  public seleccionarEvento(id) {
    this.tipoEvento = id;
  }

}
