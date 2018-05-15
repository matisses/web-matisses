import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ListaRegalosService } from '../../../services/lista-regalos.service';
//declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: 'listas-encontradas.html',
  styleUrls: ['listas-encontradas.component.css'],
  providers: [ListaRegalosService]
})

export class ResultadoBusquedaListasComponent implements OnInit {
  public resultados: number;
  public nombresNovios: string;
  public apellidosNovios: string;
  public codigoLista: string;
  public messageError: string;
  public mostrarBuscar: boolean = true;
  public mostrarBtnBuscar: boolean = true;
  private viewportWidth: number = 0;
  public listas: Array<any>;
  public esAdmin: boolean=false;
  public asunto:string='';
  public cuerpoMensaje:string='';
  public correoCreador:string='';
  public nombreNovios:string='';
  public updateMessage:string;
  public mensajePredeterminado:string;


  constructor(private _route: ActivatedRoute, private _router: Router, private _listaRegalosService: ListaRegalosService) {
    this.listas = new Array<any>();
    this.nombresNovios = JSON.parse(sessionStorage.getItem('nombresNovios'));
    this.apellidosNovios = JSON.parse(sessionStorage.getItem('apellidosNovios'));
    this.codigoLista = JSON.parse(sessionStorage.getItem('codigoLista'));
    if(sessionStorage.getItem('resultados')!=null){
      this.resultados = JSON.parse(sessionStorage.getItem('resultados')).length;
    }

    this.messageError = '';
  }

  ngOnInit() {
    if(localStorage.getItem('username-admin')!=null){
      this.esAdmin=true;
    }
    this.cargarListas();
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  ngAfterViewInit() {

    if(localStorage.getItem('username-admin')!=null){
      this.esAdmin=true;
    }
    this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    if (this.viewportWidth <= 768) {
      this.mostrarBtnBuscar = false;
      this.mostrarBuscar = false;
    } else {
      this.mostrarBuscar = true;
    }
  }

  public showBuscar() {
    if (this.mostrarBuscar) {
      this.mostrarBuscar = false;
    } else {
      this.mostrarBuscar = true;
    }
  }

  public toggleClass(idComponent) {
    $(idComponent).toggleClass("glyphicon-menu-down glyphicon-menu-up");
  }

  public removeSession(idLista: string, codigolista: string, nombreLista: string, fechaEvento: string) {
    localStorage.setItem('codigo-lista', codigolista);
    localStorage.setItem('nombreLista', nombreLista);
    localStorage.setItem('fecha-evento', fechaEvento);
    localStorage.setItem('id-lista', idLista);
    sessionStorage.removeItem('nombresNovios');
    sessionStorage.removeItem('apellidosNovios');
    sessionStorage.removeItem('codigoLista');
    //sessionStorage.removeItem('resultados');
    // sessionStorage.clear();
  }



  private scrollAfterFiter() {
    if (this.viewportWidth <= 768) {
      $("html, body").animate({ scrollTop: 400 }, 1000);
      this.showBuscar();
    } else {

    }
  }

  public cargarListas() {
    let respuesta = JSON.parse(sessionStorage.getItem('resultados'));
    if(respuesta!=null){
    for (let j = 0; j < respuesta.length; j++) {
      this.listas.push(
        {
          idLista: respuesta[j].idLista,
          codigo: respuesta[j].codigo,
          novios: respuesta[j].nombreCreador.toLowerCase() + ' ' + respuesta[j].apellidoCreador.toLowerCase() + '<span class="anpersan"> & </span>' + respuesta[j].nombreCocreador.toLowerCase() + ' ' + respuesta[j].apellidoCocreador.toLowerCase(),
          fecha: respuesta[j].formatoFechaEvento,
          correoLista:respuesta[j].correoCreador
        }
      );
      sessionStorage.setItem('novios', this.listas[j].novios);
      sessionStorage.setItem('formatoFechaEvento', this.listas[j].fecha);
    }
  }
  }

  public buscarLista() {
    this.listas = new Array<any>();
    this.messageError = '';
    if ((this.nombresNovios != null && this.nombresNovios.length > 0)
      || (this.apellidosNovios != null && this.apellidosNovios.length > 0)
      || (this.codigoLista != null && this.codigoLista.length > 0)
    ) {
      //TODO: Asignar datos para enviarlos a WS
      let consultaDTO = {
        nombre: this.nombresNovios,
        apellido: this.apellidosNovios,
        codigo: this.codigoLista
      }
      this._listaRegalosService.consultarLista(consultaDTO).subscribe(
        response => {
          if (response.length > 0) {
            for (let j = 0; j < response.length; j++) {
              this.listas.push(
                {
                  idLista: response[j].idLista,
                  codigo: response[j].codigo,
                  novios: response[j].nombreCreador.toLowerCase() + ' ' + response[j].apellidoCreador.toLowerCase() + ' & ' + response[j].nombreCocreador.toLowerCase() + ' ' + response[j].apellidoCocreador.toLowerCase(),
                  fecha: response[j].formatoFechaEvento,
                  correoLista: response[j].correoCreador
                }
              );
            }
          }
        },
        error => {
          this.messageError = 'Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.';
          console.error(error);
        }
      );
    } else {
      this.messageError = 'Debe ingresar el nombre, apellido o código.'
    }
  }

  public cerrarSession() {
    localStorage.removeItem('matisses.lista-token');
    localStorage.removeItem('username-lista');
    localStorage.removeItem('usuario-id');
    localStorage.removeItem('cambio-clave');
    localStorage.removeItem('id-lista');
    localStorage.removeItem('codigo-lista');
    localStorage.removeItem('fecha-evento');
    localStorage.removeItem('total-por-comprar');
    localStorage.removeItem('total-comprado');
    sessionStorage.removeItem('resultados');
    localStorage.removeItem('username-admin');

    this._router.navigate(['/lista-de-regalos']);
  }

  public abrirModalEnvio(modal: string, correoLista: string, nombreNovios: string){
  this.mensajePredeterminado="0";
  this.updateMessage=null;
  this.asunto='';
  this.cuerpoMensaje='';

   this.correoCreador=correoLista;
   this.nombreNovios=nombreNovios;

      $(modal).modal('show');

  }

  onChange($event) {
   if(this.mensajePredeterminado=="1"){
       this.asunto="Matisses-Felicidades por tu boda";
       this.cuerpoMensaje=" Llego el día por el que tanto han esperado, de parte del equipo Matisses queremos desearles la mayor cantidad de alegrías, el trayecto de vida ahora es un camino compartido, muchas felicidades en su día.";
     }
     if(this.mensajePredeterminado=="2"){
       this.asunto="Matisses-Necesitas ayuda con tu lista?";
       this.cuerpoMensaje="Recuerda que con  tu lista de novias Matisses puedes realizar modificaciones desde la comodidad de tu hogar y ver los resultados de dichos cambios en tiempo real, nuestro equipo está dispuesto a ayudarte siempre.";
     }
     if(this.mensajePredeterminado=="3"){
       this.asunto="Matisses-Se acerca la fecha de tu boda";
       this.cuerpoMensaje="Se acerca el día de tu boda, recuerda que cada detalle es esencial, esperamos haber sido de gran apoyo en todo este periodo. Siempre será un honor hacer parte de tu lista de novias ideal.";
     }
     if(this.mensajePredeterminado=="4"){
       this.asunto="Matisses-Requieres algun tipo de ayuda?";
       this.cuerpoMensaje="Recuerda que si necesitas algún tipo de apoyo o ayuda, nuestro equipo está atento a tus solicitudes, comprendemos que este es uno de los días más especiales y esperados para toda pareja.";
     }
     if(this.mensajePredeterminado=="5"){
       this.asunto="Matisses-Necesitas conocer mas nuestros productos?";
       this.cuerpoMensaje="Toda la información que solicites de un producto en específico estaremos atentos a tu petición, recuerda que estamos aquí para brindarte la mejor experiencia Matisses";
     }

    // I want to do something here for new selectedDevice, but what I
    // got here is always last selection, not the one I just select.
  }

  public enviarMensaje(){

    let datosMensaje = {
      asunto: this.asunto,
      mensaje: this.cuerpoMensaje,
      remitente:this.correoCreador,
      nombreRemitente: this.nombreNovios
    }

    this._listaRegalosService.enviarCorreoNovia(datosMensaje).subscribe(
      response => {
        if (response.estado == '0') {
          this.updateMessage="El mensaje ha sido enviado correctamente";
        }
    },
      error => {
        this.messageError = "Lo sentimos. Se produjo un error inesperado, inténtelo mas tarde.";
        $('#messageUser').modal('show');
        console.error(error);
      }
    );
  }
}
