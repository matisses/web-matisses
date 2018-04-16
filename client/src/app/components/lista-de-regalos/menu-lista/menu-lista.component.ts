import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ListaRegalosService } from '../../../services/lista-regalos.service';


declare var jquery: any;
declare var $: any;

@Component({
  selector: 'menu-lista',
  templateUrl: 'menu-lista.html',
  styleUrls: ['menu-lista.component.css'],
  providers: [ListaRegalosService]
})

export class MenuListaComponent implements OnInit {
  public idLista: number;
  public anoEntrega: number;
  public diaEntrega: number;
  public mesEntrega: string;
  public messageError: string;
  public messageExit: string;
  public diasEntrega: Array<number>;
  public anosEntrega: Array<number>;
  public mesesEntrega: Array<number>;
  public valid: boolean = true;

  constructor(private _route: ActivatedRoute, private _router: Router, private _listaRegalosService: ListaRegalosService) {
    this.diasEntrega = new Array<number>();
    this.mesesEntrega = new Array<number>();
    this.anosEntrega = new Array<number>();
    this.messageError = '';
    this.messageExit = '';
  }

  ngOnInit() {
    this.cargarAnos();
    this.anoEntrega = parseInt(localStorage.getItem('fecha-entrega').substring(0, 4));
    this.mesEntrega = localStorage.getItem('fecha-entrega').substring(5, 7);
    this.diaEntrega = parseInt(localStorage.getItem('fecha-entrega').substring(8, 11));
    this.cargarDias(this.mesEntrega, this.anoEntrega);
    this.idLista = parseInt(localStorage.getItem('id-lista'));
  }

  ngAfterViewInit() {
  }

  public cargarDias(mes: string, ano: number) {
    this.diasEntrega = new Array<number>();
    switch (mes) {
      case '01':  // Enero
      case '03':  // Marzo
      case '05':  // Mayo
      case '07':  // Julio
      case '08':  // Agosto
      case '10':  // Octubre
      case '12': // Diciembre
        for (let i = 1; i <= 31; i++) {
          this.diasEntrega.push(i);
        }
        break;
      case '04':  // Abril
      case '06':  // Junio
      case '09':  // Septiembre
      case '11': // Noviembre
        for (let i = 1; i <= 30; i++) {
          this.diasEntrega.push(i);
        }
        break;
      case '02':  // Febrero
        if (((ano % 100 == 0) && (ano % 400 == 0) || (ano % 100 != 0) && (ano % 4 == 0))) {
          for (let i = 1; i <= 29; i++) {
            this.diasEntrega.push(i);
          }
        } else {
          for (let i = 1; i <= 28; i++) {
            this.diasEntrega.push(i);
          }
        }
        break;
    }
  }

  public cargarAnos() {
    var date = new Date();
    var year = date.getFullYear();
    this.anosEntrega = new Array<number>();
    for (let i = year; i <= year + 1; i++) {
      this.anosEntrega.push(i);
    }
  }

  public programarFechaEntrega() {
    if ((this.anoEntrega == null || this.anoEntrega < 0) || (this.mesEntrega == null || this.mesEntrega.length < 0) || (this.diaEntrega == null)) {
      this.messageError = 'Debes llenar todos los campos obligatorios.';
      this.valid = false;
    } else {
      let datosDTO = {
        idLista: this.idLista,
        fechaEntrega: this.anoEntrega + '-' + this.mesEntrega + '-' + (this.diaEntrega + 1)
      }

      this._listaRegalosService.actualizarFechaEntrega(datosDTO).subscribe(
        response => {
          if (response.codigo == 0) {
            $("#modalFechaEntrega").modal("hide");
          } else {
            this.messageError = response.mensaje;            
          }
        },
        error => {
          console.error(error);
          this.messageError = 'Lo sentimos. Ocurrió un error inesperado, por favor inténtelo más tarde.'
        });
    }
  }
}