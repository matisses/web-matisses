import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'principal',
  templateUrl: 'home-principal.html',
  styleUrls: ['principal.component.css'],
  providers: [ItemService]
})

export class HomePrincipalComponent implements OnInit {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();

    $('.carousel').carousel({
      pause: null
    })

  }

  ngAfterViewInit() {
    // setTimeout(function() {
    //   $(document).ready(function() {
    //     $('#modalHotSale').modal('show')
    //   });
    // }, 2000); //Solo el dia del hot SALE
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('2440066').subscribe(
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('2440047').subscribe(
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('2440044').subscribe(
              response => {
                this.items.push(response.result[0]);
              }, error => { console.error(); }
            );
          }, error => { console.error(); }
        );
      }, error => { console.error(); }
    );
  }
}
