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
  private viewportWidth: number = 0;
  public resultados: number;
  public nombresNovios: string;
  public apellidosNovios: string;
  public codigoLista: string;
  public mostrarFiltros: boolean = true;
  public pruebaListas: Array<any>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _listaRegalosService: ListaRegalosService) {
    this.pruebaListas = new Array<any>();
    this.nombresNovios = JSON.parse(sessionStorage.getItem('nombresNovios'));
    this.apellidosNovios = JSON.parse(sessionStorage.getItem('apellidosNovios'));
    this.codigoLista = JSON.parse(sessionStorage.getItem('codigoLista'));
    this.resultados = JSON.parse(sessionStorage.getItem('resultados')).length;
  }

  ngOnInit() {
    this.cargarListas();
  }

  ngAfterViewInit() {
    this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 30) {
        console.log(scroll);
        $(".contenedor").addClass("margin-top-scroll");
      } else {
        $(".contenedor").removeClass("margin-top-scroll")
      }
    });
  }

  public removeSession(idLista:string) {
    console.log(idLista);
    localStorage.removeItem('id-lista');
    localStorage.setItem('id-lista',idLista);
    sessionStorage.removeItem('nombresNovios');
    sessionStorage.removeItem('apellidosNovios');
    sessionStorage.removeItem('codigoLista');
    sessionStorage.removeItem('resultados');
    // sessionStorage.clear();
  }

  public showFiltros() {
    if (this.mostrarFiltros) {
      this.mostrarFiltros = false;
    } else {
      this.mostrarFiltros = true;
    }
  }

  private scrollAfterFiter() {
    if (this.viewportWidth <= 768) {
      $("html, body").animate({ scrollTop: 400 }, 1000);
      this.showFiltros();
    } else {
      console.log('no hay que hacer scroll')
    }
  }

  public cargarListas() {
    let respuesta = JSON.parse(sessionStorage.getItem('resultados'));
    for (let j = 0; j < respuesta.length; j++) {
      this.pruebaListas.push(
        {
          idLista:respuesta[j].idLista,
          codigo: respuesta[j].codigo,
          novios: respuesta[j].nombreCreador.toLowerCase() + ' ' + respuesta[j].apellidoCreador.toLowerCase() + ' & ' + respuesta[j].nombreCocreador.toLowerCase() + ' ' + respuesta[j].apellidoCocreador.toLowerCase(),
          fecha: respuesta[j].formatoFechaEvento
        }
      );
    }
  }

  public buscarLista() {
    this.pruebaListas = new Array<any>();
    //this.messageErrorSearch = '';
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
          console.log('***********');
          //console.log(JSON.stringify(response));
          console.log(response);
          if (response.length > 0) {
            for (let j = 0; j < response.length; j++) {
              this.pruebaListas.push(
                {
                  idLista:response[j].idLista,
                  codigo: response[j].codigo,
                  novios: response[j].nombreCreador.toLowerCase() + ' ' + response[j].apellidoCreador.toLowerCase() + ' & ' + response[j].nombreCocreador.toLowerCase() + ' ' + response[j].apellidoCocreador.toLowerCase(),
                  fecha: response[j].formatoFechaEvento
                }
              );
            }
          }

          //this.nombresNovios =

          // sessionStorage.setItem('nombresNovios', JSON.stringify(this.nombresNovios));
          // sessionStorage.setItem('apellidosNovios', JSON.stringify(this.apellidosNovios));
          // sessionStorage.setItem('codigoLista', JSON.stringify(this.codigoLista));
          // sessionStorage.setItem('resultados', JSON.stringify(response));
          // this._router.navigate(['/lista-de-regalos/resultado-busqueda']);
        },
        error => {
          console.error(error);
        }
      );
    } else {
      //  this.messageErrorSearch = 'Debe ingresar un dato.'
    }
  }
}
