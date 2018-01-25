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
  public idUsuario: string;
  public cambioContrasena: string='no';
  public idListaUsuario:string;
  public codigoLista:string;
  public fechaEvento:string;

  constructor(private _route: ActivatedRoute, private _router: Router,private _userService: SessionUsuarioService, private _jwt: JWTService) {

  }

  ngOnInit() {

  }


  ngAfterViewInit() {

  }

  public login() {
    localStorage.removeItem('matisses.lista-token');
    localStorage.removeItem('username-lista');
    localStorage.removeItem('usuario-id');
    localStorage.removeItem('cambio-clave');
    localStorage.removeItem('id-lista');
    localStorage.removeItem('codigo-lista');
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

        if(response.codigo=='-1'){

          this.messageError="Error de session,datos inválidos";
          return;
        }
        this.token=response.token;
        this.idUsuario=response.usuarioId;
        this.idListaUsuario=response.idListaRegalos.idLista;
        this.codigoLista=response.idListaRegalos.codigo;
        this.fechaEvento=response.idListaRegalos.fechaEvento;
        console.log('idListaUsuario '+this.idListaUsuario);
        this.nombreSession=response.nombre;
        if(response.esNuevo){
            this.cambioContrasena='si';
        }


        this._jwt.validateToken(this.token).subscribe(
          response => {

            localStorage.setItem('matisses.lista-token', this.token);
            localStorage.setItem('username-lista',this.nombreSession);
            localStorage.setItem('usuario-id',this.idUsuario);
            localStorage.setItem('cambio-clave',this.cambioContrasena);
            localStorage.setItem('id-lista',this.idListaUsuario);
            localStorage.setItem('codigo-lista',this.codigoLista);
            localStorage.setItem('fecha-evento',this.fechaEvento);

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
