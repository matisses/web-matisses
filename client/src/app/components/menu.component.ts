import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { StickyMenuDirective } from '../directives/sticky.directive';
import { MenuItem } from '../models/menu-item';

@Component({
  selector: 'matisses-menu',
  templateUrl: '../views/menu.html',
  styleUrls: ['../../assets/css/menu.component.css'],
  animations: [
    trigger('menuAnimation', [
      state('shown', style({
        display: 'block',
        opacity: '1'
      })),
      state('hidden', style({
        display: 'none',
        opacity: '0'
      })),
      transition('shown => hidden', animate('300ms ease-out')),
      transition('hidden => shown', animate('300ms ease-out')),
    ]),
    trigger('overlayAnimation', [
      state('shown', style({
        display: 'block',
      })),
      state('hidden', style({
        display: 'none',
      })),
      transition('shown => hidden', animate('050ms ease-out')),
      transition('hidden => shown', animate('050ms ease-out')),
    ])
  ]
})

export class MenuComponent implements OnInit {
  public menuItems: Array<MenuItem>;
  public padreSeleccionado: MenuItem;
  public state: string = 'hidden';
  public stateOverlay: string = 'hidden';

  constructor(private _route: ActivatedRoute, private _router: Router) {
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
      if (this.state === 'hidden') {
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
    return this.padreSeleccionado != null && this.padreSeleccionado.codigo === codigo;
  }

  private inicializarMenu() {
    this.menuItems = new Array();

    let grandChildren = new Array();
    grandChildren.push(new MenuItem().newMenuItem('001','2 puestos'));
    grandChildren.push(new MenuItem().newMenuItem('002','3 puestos'));
    grandChildren.push(new MenuItem().newMenuItem('003','esquinero'));

    let children = new Array();
    children.push(new MenuItem().newMenuItemWithChildren('01','Sofas', grandChildren));

    let grandChildren2 = new Array();
    grandChildren2.push(new MenuItem().newMenuItem('004','King'));
    grandChildren2.push(new MenuItem().newMenuItem('005','Queen'));
    grandChildren2.push(new MenuItem().newMenuItem('006','Cunas'));
    grandChildren2.push(new MenuItem().newMenuItem('007','Mesas de noche'));

    children.push(new MenuItem().newMenuItemWithChildren('02','Habitación', grandChildren2));


    children.push(new MenuItem().newMenuItemWithChildren('03','Bar', grandChildren2));
    children.push(new MenuItem().newMenuItemWithChildren('04','Comedor', grandChildren2));
    children.push(new MenuItem().newMenuItemWithChildren('05','Mesas', grandChildren2));
    children.push(new MenuItem().newMenuItemWithChildren('06','Modulares', grandChildren2));
    children.push(new MenuItem().newMenuItemWithChildren('07','Sillas', grandChildren2));

    this.menuItems.push(new MenuItem().newMenuItemWithChildren('1','Mobiliario', children));


    this.menuItems.push(new MenuItem().newMenuItem('2','Accesorios'));
    this.menuItems.push(new MenuItem().newMenuItem('3','Bar y mesa'));


    let children2 = new Array();
    children2.push(new MenuItem().newMenuItem('08','Utensilios de especializados'));
    children2.push(new MenuItem().newMenuItem('09','Cubiertos'));
    children2.push(new MenuItem().newMenuItem('10','Cuchillos'));
    this.menuItems.push(new MenuItem().newMenuItemWithChildren('4','Cocina', children2));

    this.menuItems.push(new MenuItem().newMenuItem('5','Fragancias y velas'));
    this.menuItems.push(new MenuItem().newMenuItem('6','Gadgets'));
    this.menuItems.push(new MenuItem().newMenuItem('7','Iliminación'));
    this.menuItems.push(new MenuItem().newMenuItem('8','Libros'));
    this.menuItems.push(new MenuItem().newMenuItem('9','Regalos'));
  }

  public toggleState(state) {
    this.state = state;
  }

  public toggleStateOverlay(stateOverlay) {
    this.stateOverlay = stateOverlay;
  }

}
