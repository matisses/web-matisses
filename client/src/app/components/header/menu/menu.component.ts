import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { StickyMenuDirective } from '../../../directives/sticky.directive';
import { MenuItem } from '../../../models/menu-item';

import { MenuItemService } from '../../../services/menu.service';

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

export class MenuComponent implements OnInit {
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
  }

  public alternarSeleccionPadre(padreSeleccionado) {
    if (this.padreSeleccionado.nombre != null && this.padreSeleccionado.nombre === padreSeleccionado.nombre) {
      //this.padreSeleccionado = new MenuItem();
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

  private cargarHijos(menuItem, esPadre) {
    this._menuService.list(menuItem._id).subscribe(
      response => {
        for (let i = 0; i < response.result.length; i++) {
          menuItem.children.push(new MenuItem().newMenuItemWithRoute(
            response.result[i]._id,  //id
            response.result[i].code, //code
            response.result[i].name, //name
            response.result[i].route //route
          ));
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

  public cerrarOverlay() {
    this.padreSeleccionado = new MenuItem();
    this.toggleState('hidden');
    this.toggleStateOverlay('hidden');
  }

  public estaSeleccionado(codigo) {
    return this.padreSeleccionado != null && this.padreSeleccionado.codigo === codigo;
  }

  private inicializarMenu() {
    this.menuItems = new Array();

    this._menuService.list(null).subscribe(
      response => {
        for (let i = 0; i < response.result.length; i++) {
          this.menuItems.push(new MenuItem().newMenuItemWithRoute(
            response.result[i]._id,  //id
            response.result[i].code, //code
            response.result[i].name, //name
            response.result[i].route //route
          ));
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

}
