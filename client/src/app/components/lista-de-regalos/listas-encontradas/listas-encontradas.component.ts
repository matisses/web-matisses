import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'listas-encontradas.html',
  styleUrls: ['listas-encontradas.component.css']
})

export class ResultadoBusquedaListasComponent implements OnInit {
  public mostrarFiltros: boolean = true;
  private viewportWidth: number = 0;
  public pruebaListas: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.pruebaListas = new Array<any>();
  }

  ngOnInit() {
    this.cargarListas();
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

  private scrollAfterFiter() {
    if (this.viewportWidth <= 768) {
      $("html, body").animate({ scrollTop: 400 }, 1000);
      this.showFiltros();
    } else {
      console.log('no hay que hacer scroll')
    }
  }

  public cargarListas(){
    this.pruebaListas.push(
      {
        codigo: 654987,
        novios: "Lina Ruiz & Santiago Gárcia",
        fecha: "03 | 06 | 2018"
      }
    );
    this.pruebaListas.push(
      {
        codigo: 987654,
        novios: "Pepito Perez & Carlota Angulo",
        fecha: "06 | 12 | 2018"
      }
    );
    this.pruebaListas.push(
      {
        codigo: 321978,
        novios: "Nataly Bernal & Carlos Ubuntu",
        fecha: "11 | 07 | 2018"
      }
    );
  }

}
