import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'matisses-cuenta',
  templateUrl: 'cuenta.html',
  styleUrls: ['cuenta.component.css'],
})


export class CuentaComponent implements OnInit {
  public nombreUsuario: string;
  public correoUsuario: string;
  public celularUsuario: string;
  public telefonoUsuario: string;
  public direccionUsuario: string;
  public newsUsuario: string;
  public ajustesCuenta: boolean = false;
  public messageError: string;
  public cambiosGuardados: boolean = false;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.nombreUsuario = 'Alejandro Guerra';
    this.correoUsuario = 'agp1011@hotmail.com';
    this.celularUsuario = '3004281100';
    this.telefonoUsuario = '4185158';
    this.direccionUsuario = 'Carrera 60 # 75AA sur - 75 Casa 239';
    this.newsUsuario = 'Estás inscrito al newsletter';
    this.messageError = '';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  public editarCuenta() {
    this.ajustesCuenta = true;
  }

  public salirEditarCuenta() {
    this.ajustesCuenta = false;
  }

  public guardarCambios() {
    this.cambiosGuardados = true;
    this.messageError = 'Los ajustes fueron guardados exitosamente.';
  }

}
