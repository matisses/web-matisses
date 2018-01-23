import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {SessionUsuarioService } from '../../../services/session-usuario.service';


declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'mi-lista.html',
  styleUrls: ['mi-lista.component.css'],
  providers: [SessionUsuarioService]
})

export class MiListaComponent implements OnInit {
  public nombreUsuario: string;
  public claveNueva:string;
  public claveConfirmacion:string;
  public messageError: string;
  public valid: boolean;
  public successMessage: string;


  constructor(private _route: ActivatedRoute, private _router: Router,private _userService: SessionUsuarioService) {
      this.nombreUsuario = localStorage.getItem('username-lista');
  }

  ngOnInit() {
    // if(localStorage.getItem('cambio-clave')=='si'){
    //   $('#cambioContrasena').modal('show');
    // }
  }


  ngAfterViewInit() {
    this.nombreUsuario = localStorage.getItem('username-lista');
    setTimeout(function() {
      if(localStorage.getItem('cambio-clave')=='si'){
        $('#cambioContrasena').modal('show');
      }
    }, 500);
  }

  public actualizarClave(){



    this.messageError = '';
    if (this.claveNueva == null || this.claveNueva.length <= 0) {

      this.messageError = 'Ingresa la contraseña';
        this.valid = false;
        this.successMessage = '';
        return;
    }

    if (this.claveConfirmacion == null || this.claveConfirmacion.length <= 0 || this.claveConfirmacion == 'undefined') {
      this.messageError = 'Ingresa la confirmación de la contraseña.';
          this.valid = false;
          this.successMessage = '';
        return;
    }
    if (this.claveNueva !=this.claveConfirmacion ) {
      this.messageError = 'Ambas contraseñas deben ser iguales.';
      this.successMessage = '';
        return;
    }
    let usuarioDTO = {
      nombreUsuario: this.nombreUsuario,
      password: this.claveNueva,
      usuarioId:localStorage.getItem('usuario-id')

    }

    this._userService.updateUser(usuarioDTO).subscribe(
      response => {

        this.successMessage = '1';
        localStorage.removeItem('cambio-clave');
        localStorage.setItem('cambio-clave','no');
          $('#cambioContrasena').modal('hide');
        return;
      },
      error => {

      
        this.messageError="ocurrio un error en el servicio";
      }
    );

  }

}
