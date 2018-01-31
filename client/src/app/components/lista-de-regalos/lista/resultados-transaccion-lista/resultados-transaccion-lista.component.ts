import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ItemService } from '../../../../services/item.service';
import { Item } from '../../../../models/item';

import {SessionUsuarioService } from '../../../../services/session-usuario.service';
import {ListaRegalosService } from '../../../../services/lista-regalos.service';

declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'resultados-transaccion-lista.html',
  styleUrls: ['resultados-transaccion-lista.component.css'],
  providers: [ItemService, SessionUsuarioService,ListaRegalosService]
})

export class ResultadoTransaccionListaComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _userService: SessionUsuarioService, private _listaService: ListaRegalosService) {

  }

  ngOnInit() {

  }


  ngAfterViewInit() {
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

  
}
