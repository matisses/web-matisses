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
  public mesEntrega: string;
  public anoEntrega: string;
  public diaEntrega: string;
  public messageError: string;
  public messageExit: string;
  public dayEntrega: Array<number>;
  public yearEntrega: Array<number>;
  public monthEntrega: Array<number>;
  public valid: boolean = true;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el menu de la lista de regalos ';
    this.dayEntrega = new Array<number>();
    this.monthEntrega = new Array<number>();
    this.yearEntrega = new Array<number>();
    this.messageError = '';
    this.messageExit = '';
  }

  ngOnInit() {
    this.cargarAnos();
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

  public cargarDias(mes: string, ano: number) {    
    this.dayEntrega = new Array<number>();
    switch (mes) {
      case '01':  // Enero
      case '03':  // Marzo
      case '05':  // Mayo
      case '07':  // Julio
      case '08':  // Agosto
      case '10':  // Octubre
      case '12': // Diciembre
        for (let i = 1; i <= 31; i++) {
          this.dayEntrega.push(i);
        }
        break;
      case '04':  // Abril
      case '06':  // Junio
      case '09':  // Septiembre
      case '11': // Noviembre
        for (let i = 1; i <= 30; i++) {
          this.dayEntrega.push(i);
        }
        break;
      case '02':  // Febrero
        if (((ano % 100 == 0) && (ano % 400 == 0) || (ano % 100 != 0) && (ano % 4 == 0))) {
          for (let i = 1; i <= 29; i++) {
            this.dayEntrega.push(i);
          }
        } else {
          for (let i = 1; i <= 28; i++) {
            this.dayEntrega.push(i);
          }
        }
        break;
    }
  }

  public cargarAnos() {
    var date = new Date();
    var year = date.getFullYear();
    this.yearEntrega = new Array<number>();
    for (let i = year; i <= year + 1; i++) {
      this.yearEntrega.push(i);
    }
  }

  public programarFechaEntrega(){
    console.log('entro a programar fecha de entrega.');

  }
}
