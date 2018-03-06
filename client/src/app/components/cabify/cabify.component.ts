import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';

//declare var jquery: any;
declare var $: any;

@Component({
    templateUrl: 'cabify.html',
    styleUrls: ['cabify.component.css'],
    providers: [ItemService]
})

export class CabifyComponent implements OnInit {
    public items: Array<Item>;

    constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService) {

    }

    ngOnInit() {
    }

}
