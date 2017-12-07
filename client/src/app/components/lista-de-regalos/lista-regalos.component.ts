import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'lista-regalos.html',
  styleUrls: ['lista-regalos.component.css']
})

export class ListaRegalosComponent implements OnInit {
  public title: string;
  public showModal: boolean;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo del lista regalos ';
  }

  ngOnInit() {
    $(".slider").slick({
      prevArrow: '.slider-container .prev',
      nextArrow: '.slider-container .next',
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
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
