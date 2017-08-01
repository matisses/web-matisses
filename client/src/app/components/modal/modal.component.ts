import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'modal.html',
  styleUrls: ['modal.component.css']
})

export class ModalComponent implements OnInit {
  public title: string;
  public showModal: boolean;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo del modal ';
  }

  ngOnInit() {
    console.log('inicializando componente de modal');
    $('#modal').click();
  }


  ngAfterViewInit() {
    console.log('termino de cargar el componente');

  }

}
