import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SessionUsuarioService } from '../../../../services/session-usuario.service';
import { JWTService } from '../../../../services/jwt.service';

declare var $: any;

@Component({
  templateUrl: 'confirmar-usuario.html',
  styleUrls: ['confirmar-usuario.component.css'],
  providers: [SessionUsuarioService,JWTService]
})

export class ConfirmarUsuarioComponent implements OnInit {
  public queryParams: Map<string, string>;
  public queryString: string;
  public nombreUsuario: string;
  public password: string;
  public token: string;
  public nombreSession: string;
  public idUsuario: string;
  public cambioContrasena: string = 'no';
  public messageError: string;
  public valid: boolean = true;
  public documentCustomer:string;
  public decorador:boolean=false;
  public planificador:boolean=false;
  public successMessage: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: SessionUsuarioService,private _jwt: JWTService) {
  }

  ngOnInit() {
    this.confirmarUsuario();
  }

  ngAfterViewInit() {
  }

  public confirmarUsuario() {
    this._route.params.forEach((params: Params) => {
      //Llamar servicio para confirmar asistencia
      this._userService.confirmarUsuario(params['nuser']).subscribe(
        response => {
          this.successMessage="Bienvenido, tu cuenta ha sido activada correctamente. Ahora puedes iniciar sesión";
          //this._router.navigate(['/login']);
        }, error => { console.error(error); }
      );
    });
  }

  public login() {

    this.valid = true;
    this.messageError = '';
    if (this.nombreUsuario == null || this.nombreUsuario.length <= 0) {

      this.messageError = 'Ingresa tu dirección de correo principal.';
      $('#messageUser').modal('show');
      return;
    }
    if (this.password == null || this.password.length <= 0) {
      this.messageError = 'Debes ingresar tu clave.';
      $('#messageUser').modal('show');
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
          $('#messageUser').modal('show');
          return;
        }

        this.token = response.token;
        this.idUsuario = response.usuarioId;
        this.nombreSession = response.nombre;
        this.documentCustomer=response.documento;
        this.nombreUsuario=response.nombreUsuario;
        if(response.esDecorador!=null){
          this.decorador=response.esDecorador;
        }
        if(response.esPlanificador!=null){
            this.planificador=response.esPlanificador;
        }


        if (response.esNuevo) {
          this.cambioContrasena = 'si';
        }
        this._jwt.validateToken(this.token).subscribe(
          response => {

          }, error => {
            console.error(error);
            localStorage.removeItem('matisses.lista-token');
          }
        );
        localStorage.setItem('matisses.session-token', this.token);
        localStorage.setItem('username', this.nombreSession);
        localStorage.setItem('usuario-id', this.idUsuario);
        localStorage.setItem('cambio-clave', this.cambioContrasena);
        localStorage.setItem('doc-customer', this.documentCustomer);
        localStorage.setItem('nombre-usuario', this.nombreUsuario);
        localStorage.setItem('usuario-decorador',this.decorador.toString());
        localStorage.setItem('usuario-planificador',this.planificador.toString());

        this._router.navigate(['/mi-cuenta']);
      },
      error => {
        this.messageError = "Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.";
        $('#messageUser').modal('show');
        console.error(error);
      }
    );
  }

  private navigate(codigoLista: string) {
    let queryParamsObj = {};
    queryParamsObj['codigoLista'] = codigoLista;
    this._router.navigate(['/lista'], { queryParams: queryParamsObj });
  }
}
