import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../../services/item.service';
import { Item } from '../../../../models/item';

declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'agregar-productos.html',
  styleUrls: ['agregar-productos.component.css'],
  providers: [ItemService]
})

export class AgregarProductosComponent implements OnInit {
  public items: Array<Item>;
  public mostrarFiltros: boolean = true;
  private viewportWidth: number = 0;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();
  }


  ngAfterViewInit() {

    this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 30) {
        console.log(scroll);
        $(".contenedor").addClass("margin-top-scroll");
      } else {
        $(".contenedor").removeClass("margin-top-scroll")
      }
    });
  }

  public showFiltros() {
    if (this.mostrarFiltros) {
      this.mostrarFiltros = false;
    } else {
      this.mostrarFiltros = true;
    }
  }

  public toggleClass(idComponent) {
    $(idComponent).toggleClass("icon-plus icon-minus");
  }

  private scrollAfterFiter() {
    if (this.viewportWidth <= 768) {
      $("html, body").animate({ scrollTop: 400 }, 1000);
      this.showFiltros();
    } else {
      console.log('no hay que hacer scroll')
    }
  }

  private inicializarItems() {

    this.items = new Array<Item>();

    this._itemService.find('2280058').subscribe( // Item 1
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('2240080').subscribe( // Item 1
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('2090109').subscribe( // Item 1
              response => {
                this.items.push(response.result[0]);
                this._itemService.find('2230002').subscribe( // Item 1
                  response => {
                    this.items.push(response.result[0]);
                    this._itemService.find('2090108').subscribe( // Item 1
                      response => {
                        this.items.push(response.result[0]);
                        this._itemService.find('2410024').subscribe( // Item 1
                          response => {
                            this.items.push(response.result[0]);
                            this._itemService.find('2310428').subscribe( // Item 1
                              response => {
                                this.items.push(response.result[0]);
                                this._itemService.find('2310429').subscribe( // Item 1
                                  response => {
                                    this.items.push(response.result[0]);

                                  }, error => { console.error(); }
                                );
                              }, error => { console.error(); }
                            );
                          }, error => { console.error(); }
                        );
                      }, error => { console.error(); }
                    );
                  }, error => { console.error(); }
                );
              }, error => { console.error(); }
            );
          }, error => { console.error(); }
        );
      }, error => { console.error(); }
    );
  }

}
