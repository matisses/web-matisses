import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {SessionUsuarioService } from '../../services/session-usuario.service';
import {JWTService } from '../../services/jwt.service';
declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'lista-regalos.html',
  styleUrls: ['lista-regalos.component.css'],
  providers: [SessionUsuarioService,JWTService]
})

export class ListaRegalosComponent implements OnInit {


  public messageError: string;
  public nombreUsuario: string;
  public password: string;
  public valid: boolean = true;
  public token: string;
  public nombreSession: string;
  public cambioContrasena: string='no';

  constructor(private _route: ActivatedRoute, private _router: Router,private _userService: SessionUsuarioService, private _jwt: JWTService) {

  }

  ngOnInit() {

  }


  ngAfterViewInit() {

  }

  public login() {
    this.valid = true;
    this.messageError = '';
    if (this.nombreUsuario == null || this.nombreUsuario.length <= 0) {
      this.messageError = 'Ingresa tu dirección de correo principal';
      return;
    }
    if (this.password == null || this.password.length <= 0) {
      this.messageError = 'Debes ingresar tu clave.';
      return;
    }
    let usuarioDTO = {
      nombreUsuario: this.nombreUsuario,
      password: this.password

    }
    this._userService.login(usuarioDTO).subscribe(
      response => {
        console.log("retorno el usuario");
        console.log(response);
        this.token=response.token;
        this.nombreSession=response.nombre;
        if(response.esNuevo){
            this.cambioContrasena='si';
        }

        console.log(this.token);
        this._jwt.validateToken(this.token).subscribe(
          response => {
            console.log(response);
            localStorage.setItem('matisses.lista-token', this.token);
            localStorage.setItem('username-lista',this.nombreSession);
            localStorage.setItem('cambio-clave',this.cambioContrasena);
            console.log(localStorage);
          }, error => {
            console.error(error);
            localStorage.removeItem('matisses.lista-token');
          }
        );
        this._router.navigate(['/mi-lista']);
      },
      error => {
        console.error(error);
        this.messageError="ocurrio un error en el servicio";
      }
    );
  }


}
