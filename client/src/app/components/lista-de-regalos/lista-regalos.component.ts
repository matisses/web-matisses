import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SessionUsuarioService } from '../../services/session-usuario.service';
import { JWTService } from '../../services/jwt.service';
import { ListaRegalosService } from '../../services/lista-regalos.service';
//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'lista-regalos.html',
  styleUrls: ['lista-regalos.component.css'],
  providers: [SessionUsuarioService, JWTService, ListaRegalosService]
})

export class ListaRegalosComponent implements OnInit {

  public nombreUsuario: string;
  public password: string;
  public token: string;
  public nombreSession: string;
  public idUsuario: string;
  public cambioContrasena: string = 'no';
  public idListaUsuario: string;
  public codigoLista: string;
  public fechaEvento: string;
  public messageError: string
  public nombresNovios: string;
  public apellidosNovios: string;
  public messageErrorSearch: string;
  public valid: boolean = true;
  public mostrarBuscar: boolean = true;
  public mostrarCrear: boolean = true;
  public mostrarManage: boolean = true;
  private viewportWidth: number = 0;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: SessionUsuarioService, private _jwt: JWTService,
    private _listaRegalosService: ListaRegalosService) {
    this.nombresNovios = '';
    this.apellidosNovios = '';
    this.codigoLista = '';
    this.messageErrorSearch = '';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    
      localStorage.clear();
    this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (this.viewportWidth <= 767) {
      this.showCampos(-1);
    } else {
    }
  }

  public showCampos(option: number) {
    if (this.viewportWidth <= 768) {
      if ((option === 0 || option === 1) && !this.mostrarBuscar) {
        this.mostrarBuscar = true;
      } else {
        this.mostrarBuscar = false;
      }
      if ((option === 0 || option === 2) && !this.mostrarCrear) {
        this.mostrarCrear = true;
      } else {
        this.mostrarCrear = false;
      }
      if ((option === 0 || option === 3) && !this.mostrarManage) {
        this.mostrarManage = true;
      } else {
        this.mostrarManage = false;
      }
    } else {
    }
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
        this.idListaUsuario = response.idListaRegalos.idLista;
        this.codigoLista = response.idListaRegalos.codigo;
        this.fechaEvento = response.idListaRegalos.fechaEvento;
        this.nombreSession = response.nombre;
        if (response.esNuevo) {
          this.cambioContrasena = 'si';
        }
        this._jwt.validateToken(this.token).subscribe(
          response => {
            console.log('token validado');
          }, error => {
            console.error(error);
            localStorage.removeItem('matisses.lista-token');
          }
        );
        localStorage.setItem('matisses.lista-token', this.token);
        localStorage.setItem('username-lista', this.nombreSession);
        localStorage.setItem('usuario-id', this.idUsuario);
        localStorage.setItem('cambio-clave', this.cambioContrasena);
        sessionStorage.setItem('id-lista', this.idListaUsuario);
        localStorage.setItem('codigo-lista', this.codigoLista);
        localStorage.setItem('fecha-evento', this.fechaEvento);
        console.log('token '+localStorage.getItem('matisses.lista-token'));
        this._router.navigate(['/mi-lista']);
      },
      error => {
        console.error(error);
        this.messageError = "Lo sentimos. Se produjo un error inesperado, intentelo mas tarde.";
      }
    );
  }

  public buscarLista() {
    localStorage.removeItem('id-lista');
    localStorage.removeItem('username-lista');
    localStorage.removeItem('codigo-lista');
    localStorage.removeItem('fecha-evento');

    this.messageErrorSearch = '';
    if ((this.nombresNovios != null && this.nombresNovios.length > 0)
      || (this.apellidosNovios != null && this.apellidosNovios.length > 0)
      || (this.codigoLista != null && this.codigoLista.length > 0)
    ) {
      //Asignar datos para enviarlos a WS
      let consultaDTO = {
        nombre: this.nombresNovios,
        apellido: this.apellidosNovios,
        codigo: this.codigoLista
      }
      this._listaRegalosService.consultarLista(consultaDTO).subscribe(
        response => {
          if (response.length > 0) {
            sessionStorage.setItem('nombresNovios', JSON.stringify(this.nombresNovios));
            sessionStorage.setItem('apellidosNovios', JSON.stringify(this.apellidosNovios));
            sessionStorage.setItem('codigoLista', JSON.stringify(this.codigoLista));
            localStorage.setItem('codigo-lista', this.codigoLista);
            sessionStorage.setItem('resultados', JSON.stringify(response));

            this._router.navigate(['/lista-de-regalos/resultado-busqueda']);
          } else {
            this.messageErrorSearch = 'No se encontro la lista.'
          }
        },
        error => {
          console.error(error);
        }
      );
    } else {
      this.messageErrorSearch = 'Debe ingresar un dato.'
    }
  }
}
