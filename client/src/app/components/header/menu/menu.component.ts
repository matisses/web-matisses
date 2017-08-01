import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { StickyMenuDirective } from '../../../directives/sticky.directive';
import { MenuItem } from '../../../models/menu-item';

import { MenuItemService } from '../../../services/menu.service';

declare var $: any;

@Component({
  selector: 'matisses-menu',
  templateUrl: 'menu.html',
  styleUrls: ['menu.component.css'],
  providers: [MenuItemService],
  animations: [
    trigger('menuAnimation', [
      state('shown', style({
        display: 'block',
        opacity: '1',
      })),
      state('hidden', style({
        display: 'none',
        opacity: '0',
      })),
      transition('shown => hidden', animate('400ms ease-out')),
      transition('hidden => shown', animate('300ms ease-out')),
    ]),
    trigger('overlayAnimation', [
      state('shown', style({
        display: 'block',
        opacity: '0.5'
      })),
      state('hidden', style({
        display: 'none',
        opacity: '0'
      })),
      transition('shown => hidden', animate('200ms ease-out')),
      transition('hidden => shown', animate('800ms ease-in')),
    ])
  ]
})

export class MenuComponent implements OnInit, AfterViewInit {
  public menuItems: Array<MenuItem>;
  public padreSeleccionado: MenuItem;
  public state: string = 'hidden';
  public stateOverlay: string = 'hidden';

  constructor(private _menuService: MenuItemService, private _route: ActivatedRoute, private _router: Router) {
    this.padreSeleccionado = new MenuItem();

  }

  ngOnInit() {
    console.log('inicializando componente de menú');
    this.inicializarMenu();
    document.getElementById("myNav").style.width = "0%";
  }

  ngAfterViewInit() {
    console.log('finalizo la carga');
  }

  public alternarSeleccionPadre(padreSeleccionado) {
    if (this.padreSeleccionado.code != null && this.padreSeleccionado.code === padreSeleccionado.code) {
      this.padreSeleccionado = new MenuItem();
    } else {
      this.padreSeleccionado = padreSeleccionado;
      if (typeof this.padreSeleccionado.children == 'undefined' || this.padreSeleccionado.children.length === 0) {
        //cargar hijos de base de datos
        this.cargarHijos(this.padreSeleccionado, true);
      } else if (this.state === 'hidden' && this.padreSeleccionado.children.length > 0) {
        this.toggleState('shown');
        this.toggleStateOverlay('shown');
      }
    }
  }

  public cerrarOverlay() {
    this.padreSeleccionado = new MenuItem();
    this.toggleState('hidden');
    this.toggleStateOverlay('hidden');
  }

  public estaSeleccionado(codigo) {
    return this.padreSeleccionado != null && this.padreSeleccionado.code === codigo
  }

  private inicializarMenu() {
    this.menuItems = new Array();

    this._menuService.list(null).subscribe(
      response => {
        for (let i = 0; i < response.result.length; i++) {
          let menuItem = new MenuItem();
          menuItem._id = response.result[i]._id;
          menuItem.code = response.result[i].code;
          menuItem.name = response.result[i].name;
          menuItem.department = response.result[i].department;
          menuItem.group = response.result[i].group;
          menuItem.subgroup = response.result[i].subgroup;
          this.menuItems.push(menuItem);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private cargarHijos(menuItem, esPadre) {
    this._menuService.list(menuItem._id).subscribe(
      response => {
        for (let i = 0; i < response.result.length; i++) {
          let child = new MenuItem();
          child._id = response.result[i]._id;
          child.code = response.result[i].code;
          child.name = response.result[i].name;
          child.department = response.result[i].department;
          child.group = response.result[i].group;
          child.subgroup = response.result[i].subgroup;

          menuItem.children.push(child);
          this.cargarHijos(menuItem.children[menuItem.children.length - 1], false);
        }
        if (esPadre) {
          if (menuItem.children.length > 0) {
            this.toggleState('shown');
            this.toggleStateOverlay('shown');
          } else {
            this.toggleState('hidden');
            this.toggleStateOverlay('hidden');
          }
        }


      },
      error => {
        console.log(error);
      }
    );
  }

  public toggleState(state) {
    this.state = state;
  }

  public toggleStateOverlay(stateOverlay) {
    this.stateOverlay = stateOverlay;
  }


  public toggleNav() {
    if (document.getElementById("myNav").style.width === '0%') {
      document.getElementById("myNav").style.width = "100%";
    } else {
      document.getElementById("myNav").style.width = "0%";
    }
  }

  public toggleClass(idComponent, class1, class2) {
    console.log('toggle idComponent: ' + idComponent + ', class1: ' + class1 + ', class2: ' + class2);
    $(idComponent).toggleClass(class1 + " " + class2);
  }

  public openAccordion(idComponent) {
    document.getElementById("idComponent").style.display = "block";
  }

}
