import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'hot-sale.html',
  styleUrls: ['hot-sale.component.css'],
  providers: [ItemService]
})

export class HotSaleComponent implements OnInit {
  public items: Array<Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this.inicializarItems();
  }

  private inicializarItems() {
    this.items = new Array<Item>();
    this._itemService.find('2280058').subscribe( // Item 1
      response => {
        this.items.push(response.result[0]);
        this._itemService.find('2280056').subscribe( // Item 2
          response => {
            this.items.push(response.result[0]);
            this._itemService.find('2280035').subscribe(// Item 3
              response => {
                this.items.push(response.result[0]);
                this._itemService.find('2280057').subscribe(// Item 4
                  response => {
                    this.items.push(response.result[0]);
                    this._itemService.find('2280076').subscribe(// Item 5
                      response => {
                        this.items.push(response.result[0]);
                        this._itemService.find('2280027').subscribe(// Item 6
                          response => {
                            this.items.push(response.result[0]);
                            this._itemService.find('2280021').subscribe(// Item 7
                              response => {
                                this.items.push(response.result[0]);
                                this._itemService.find('2280033').subscribe(// Item 8
                                  response => {
                                    this.items.push(response.result[0]);
                                    this._itemService.find('2230019').subscribe(// Item 9
                                      response => {
                                        this.items.push(response.result[0]);
                                        this._itemService.find('2230017').subscribe(// Item 10
                                          response => {
                                            this.items.push(response.result[0]);
                                            this._itemService.find('2230007').subscribe(// Item 11
                                              response => {
                                                this.items.push(response.result[0]);
                                                this._itemService.find('2230011').subscribe(// Item 12
                                                  response => {
                                                    this.items.push(response.result[0]);
                                                    this._itemService.find('2420001').subscribe(// Item 13
                                                      response => {
                                                        this.items.push(response.result[0]);
                                                        this._itemService.find('2420002').subscribe(// Item 14
                                                          response => {
                                                            this.items.push(response.result[0]);
                                                            this._itemService.find('2420003').subscribe(// Item 15
                                                              response => {
                                                                this.items.push(response.result[0]);
                                                                this._itemService.find('2420038').subscribe(// Item 16
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
