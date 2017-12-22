import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


declare var jQuery: any;
declare var $: any;

@Component({
  templateUrl: 'crear-lista.html',
  styleUrls: ['crear-lista.component.css']
})

export class CrearListaComponent implements OnInit {
  public tipoEvento: number = 0;
  public paso: number = 1;

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 30) {
        $(".contenedor-formulario").addClass("margin-top-scroll");
      } else {
        $(".contenedor-formulario").removeClass("margin-top-scroll")
      }
    });

    //Bloqueo del botón ir atras, no deja al usuario ir atras.
    window.onload = function() {
      if (typeof history.pushState === "function") {
        history.pushState(null, null, null);
        window.onpopstate = function() {
          history.pushState(null, null, null);
        };
      }
    }

    //Mensaje de pereder los datos si recarga la página.
    window.onbeforeunload = function(e) {
      var e = e || window.event;
      var msg = "¿De verdad quieres dejar esta página?"
      // For IE and Firefox
      if (e) {
        e.returnValue = msg;
      }
      // For Safari / chrome
      return msg;
    };
  }


  ngAfterViewInit() {

  }

  public seleccionarEvento(id) {
    this.tipoEvento = id;
  }

  public obtenerSiguientePaso() {
    if (this.paso < 4) {
      this.paso++;
    }
  }

  public obtenerPasoAnterior() {
    if (this.paso < 5) {
      this.paso--;
    }
  }

}
