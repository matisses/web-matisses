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
  }


  ngAfterViewInit() {
    $(document).ready(function() {
      $("#corazon").click(function() {
        $('#full').show();
        $('#corazon').hide();
      });
      $("#full").click(function() {
        $('#full').hide();
        $('#corazon').show();
      });
    });

  }

}
