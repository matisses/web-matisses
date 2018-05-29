import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'condiciones-complementos.html',
  styleUrls: ['condiciones-complementos.component.css'],
  providers: [ItemService]
})

export class CondicionesComplementosAlfComponent implements OnInit {
  public itemsCarousel: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarCarousel();
  }

  ngAfterViewInit() {
    setTimeout(function() {
      $("#items").click();
    }, 500);
   }



  private inicializarCarousel() {
    this.itemsCarousel = new Array<Item>();
    let refes = [
     '2220643',
     '2220184',
     '2220526',
     '2220613',
     '2220267',
     '2220212',
     '2220538',
     '2220910',
     '2220356',
     '2220036',
     '2220042',
     '2220049'
    ];

    for (let i = 0; i < refes.length; i++) {
      this._itemService.find(refes[i]).subscribe(
        response => {
          this.itemsCarousel.push(response.result[0]);
        }, error => { console.error(); }
      );
    }
  }

  public slickItems() {
    $(".slider-items").slick({
      prevArrow: '.slider-items-container .prev',
      nextArrow: '.slider-items-container .next',
      slidesToShow: 4,
      slidesToScroll: 2,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
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

  public formatNumber(num:number) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

}
