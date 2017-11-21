import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Item } from '../../../../models/item';

import { CarritoSimpleComponent } from './carrito-simple.component';

declare var $: any;

@Component({
  selector: 'matisses-carrito',
  templateUrl: 'carrito.html',
  styleUrls: ['carrito.component.css']
})
export class CarritoComponent implements OnInit, AfterViewInit {
  @ViewChild(CarritoSimpleComponent)
  public carrito: CarritoSimpleComponent;
  private viewportWidth: number = 0;
  public url: string;
  public resumenMobileVisible: boolean = false;
  public resumenDesktopVisible: boolean = false;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.url = this._router.url;
  }

  ngOnInit() {
    this.carrito.cargarCarrito();
  }

  ngAfterViewInit() {
    this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

  public clickCarrito(){
    setTimeout(function() {
        $('.carrito').click()
        console.log('desplegando resumen de carrito')
    }, 1000);
  }

  public toggleResumen() {
    if (this.resumenMobileVisible || this.resumenDesktopVisible) {
      //ocultar mobile
      this.closeResumen();
    } else {
      //mostrar mobile/desktop
      this.openResumen();
    }
  }

  private openResumen() {
    if (this.viewportWidth <= 991) {
      //mostrar mobile
      const divs = document.getElementById("carrito1").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "315px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0.75)";
          this.resumenMobileVisible = true;
          break;
        }
      }
    } else {
      //mostrar desktop
      const divs = document.getElementById("carrito2").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "315px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0.75)";
          this.resumenDesktopVisible = true;
          break;
        }
      }
    }
    this.carrito.cargarCarrito();
  }

  public closeResumen() {
    if (this.viewportWidth <= 991) {
      //mostrar mobile
      const divs = document.getElementById("carrito1").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "0px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0)";
          this.resumenMobileVisible = false;
          break;
        }
      }
    } else {
      //mostrar desktop
      const divs = document.getElementById("carrito2").getElementsByTagName("div");
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'resumen') {
          divs[i].style.height = "0px";
          divs[i].style.boxShadow = "0px 5px 16px 0px rgba(0, 0, 0, 0)";
          this.resumenDesktopVisible = false;
          break;
        }
      }
    }
  }

  public eliminarItem(item: Item) {
    item.selectedQuantity = 0;
    this.carrito.procesarItem(item);
  }

  public mostrarBotonEliminar() {
    return this.url && !this.url.includes('pago') && !this.url.includes('carrito');
  }

  public cambiarBtn() {
    $("#bolsa").on("click", function() {
      $('#cerrar').show();
    });
  }
}
