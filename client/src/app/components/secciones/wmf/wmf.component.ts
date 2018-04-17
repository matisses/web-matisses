import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';


//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'seccion-wmf',
  templateUrl: 'wmf.html',
  styleUrls: ['wmf.component.css'],
  providers: [ItemService],

})

export class WmfSeccionComponent implements OnInit {
  public itemswmf: Array<Item>;
  public itemsCarousel: Array<Item>;


  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) { }

  ngOnInit() {
    this.inicializarItems();
    this.inicializarCarousel();
  }

  ngAfterViewInit() {
    setTimeout(function() {
      $("#wmf").click();
    }, 1050);
   }

  private inicializarItems() {
    this.itemswmf = new Array<Item>();
    let refs = ['2310153', '2310360', '2310398'];

    for (let i = 0; i < refs.length; i++) {
      this._itemService.find(refs[i]).subscribe(
        response => {
          this.itemswmf.push(response.result[0]);
        }, error => { console.error(); }
      );
    }
  }

  private inicializarCarousel() {
    this.itemsCarousel = new Array<Item>();
    let refes = [
     '2310400',
     '2310402',
     '2310406',
     '2310681',
     '2310403',
     '2310683',
     '2310676',
     '2310677',
     '2310408',
     '2310668',
     '2310082',
     '2310407'
    ];

    for (let i = 0; i < refes.length; i++) {
      this._itemService.find(refes[i]).subscribe(
        response => {
          this.itemsCarousel.push(response.result[0]);
        }, error => { console.error(); }
      );
    }
  }

  public slickwmf() {
    $(".slider-wmf").slick({
      prevArrow: '.slider-wmf-container .prev',
      nextArrow: '.slider-wmf-container .next',
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



}
