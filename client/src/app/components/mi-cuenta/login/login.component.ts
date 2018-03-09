import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SessionUsuarioService } from '../../../services/session-usuario.service';
import { JWTService } from '../../../services/jwt.service';

import { Customer } from '../../../models/customer';
import { City } from '../../../models/city';

import { CustomerService } from '../../../services/customer.service';
import { CityService } from '../../../services/city.service';
//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'login.html',
  styleUrls: ['login.component.css'],
    providers: [SessionUsuarioService, JWTService,CustomerService, CityService]
})


export class LoginComponent implements OnInit {
  public title: string;

  public nombreUsuario: string;
  public password: string;
  public token: string;
  public nombreSession: string;
  public idUsuario: string;
  public cambioContrasena: string = 'no';
  public messageError: string;
  public valid: boolean = true;
  public customer: Customer;


  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: SessionUsuarioService, private _jwt: JWTService) {
    this.title = 'Este es el cuerpo de login';
    this.customer = new Customer();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    })

  }

  public modalRecuperarPassword () {
    $('#forgotPassword').modal('show');
  }

  public login() {

    this.valid = true;
    this.messageError = '';
    if (this.nombreUsuario == null || this.nombreUsuario.length <= 0) {
      this.messageError = 'Ingresa tu dirección de correo principal.';
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
        if (response.codigo == '-1') {
          this.messageError = "Error de sesión, datos inválidos.";
          return;
        }
        this.token = response.token;
        this.idUsuario = response.usuarioId;
        this.nombreSession = response.nombre;
        if (response.esNuevo) {
          this.cambioContrasena = 'si';
        }
        this._jwt.validateToken(this.token).subscribe(
          response => {
            console.log('token '+this.token);
              console.log(response);
          }, error => {
            console.error(error);
            localStorage.removeItem('matisses.lista-token');
          }
        );
        localStorage.setItem('matisses.session-token', this.token);
        localStorage.setItem('username', this.nombreSession);
        localStorage.setItem('usuario-id', this.idUsuario);
        localStorage.setItem('cambio-clave', this.cambioContrasena);


        this._router.navigate(['/mi-cuenta']);
      },
      error => {
        this.messageError = "Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.";
        console.error(error);
      }
    );
  }


}
