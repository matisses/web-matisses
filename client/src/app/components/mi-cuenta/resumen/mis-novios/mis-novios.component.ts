import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'matisses-novios',
  templateUrl: 'mis-novios.html',
  styleUrls: ['mis-novios.component.css'],
})


export class NoviosComponent implements OnInit {
  public title: string;
  public clientes: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.title = 'Este es el cuerpo de novios';
    this.clientes = Array<any>();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
    this.forClientes();
  }

  public forClientes() {
    this.clientes.push({
      nombres: "Diana Ríos y Pablo Moreno",
      codigo: "DR140418",
      puntos: "9500000",
      fechaEvento: "14 | 04 | 18",
    });
    this.clientes.push({
      nombres: "Maria del pilar Restrepo y Nombre Apellido",
      codigo: "NA150518",
      puntos: "15200000",
      fechaEvento: "15 | 05 | 18",
    });
    this.clientes.push({
      nombres: "Nombre Apellido y Nombre Apellido",
      codigo: "NA141218",
      puntos: "18000000",
      fechaEvento: "14 | 12 | 18",
    });
  }

}
