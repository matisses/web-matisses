import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'beneficios.html',
  styleUrls: ['beneficios.component.css'],
})

export class BeneficiosComponent implements OnInit {


  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    $(".slider-aliados").slick({
      prevArrow: '.slider-container .prev',
      nextArrow: '.slider-container .next',
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
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

}
