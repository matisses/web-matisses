import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jquery: any;
declare var $: any;

@Component({
  selector: 'menu-lista',
  templateUrl: 'menu-lista.html',
  styleUrls: ['menu-lista.component.css']
})

export class MenuListaComponent implements OnInit {
  public title: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el menu de la lista de regalos ';
  }

  ngOnInit() {
    // $(window).scroll(function() {
    //   var scroll = $(window).scrollTop();
    //   if (scroll >= 30) {
    //     $(".menu-lista").addClass("fixed");
    //   } else {
    //     $(".menu-lista").removeClass("fixed")
    //   }
    // });
  }


  ngAfterViewInit() {

  }

}
