import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { StickyMenuDirective } from '../directives/sticky.directive';
import { MenuItem } from '../models/menu-item';

@Component({
    selector: 'matisses-menu',
    templateUrl: '../views/menu.html',
    styleUrls: ['../../assets/css/menu.component.css']
    /*,
    directives: [StickyMenuDirective]*/
})

export class MenuComponent implements OnInit {
    public menuItems:Array<MenuItem>;
    public padreSeleccionado:MenuItem;

    constructor(private _route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
        console.log('inicializando componente de menú');
        this.inicializarMenu();
    }

    public alternarSeleccionPadre(padreSeleccionado) {
      if (this.padreSeleccionado != null && this.padreSeleccionado.nombre === padreSeleccionado.nombre ){
        this.padreSeleccionado = null;
      } else {
          this.padreSeleccionado = padreSeleccionado;
      }
    }

    public cerrarOverlay(){
        this.padreSeleccionado = null;
    }

    public estaSeleccionado(nombre){
      return this.padreSeleccionado != null && this.padreSeleccionado.nombre === nombre;
    }

    private inicializarMenu (){
      this.menuItems = new Array();

      let grandChildren = new Array();
      grandChildren.push(new MenuItem().newMenuItem('2 puestos'));
      grandChildren.push(new MenuItem().newMenuItem('3 puestos'));
      grandChildren.push(new MenuItem().newMenuItem('esquinero'));

      let children = new Array();
      children.push(new MenuItem().newMenuItemWithChildren('sofas', grandChildren));

      let grandChildren2 = new Array();
      grandChildren2.push(new MenuItem().newMenuItem('King'));
      grandChildren2.push(new MenuItem().newMenuItem('Queen'));
      grandChildren2.push(new MenuItem().newMenuItem('Cunas'));
      grandChildren2.push(new MenuItem().newMenuItem('Mesas de noche'));

      children.push(new MenuItem().newMenuItemWithChildren('Habitación', grandChildren2));
      children.push(new MenuItem().newMenuItemWithChildren('Bar', grandChildren2));
      children.push(new MenuItem().newMenuItemWithChildren('Comedor', grandChildren2));
      children.push(new MenuItem().newMenuItemWithChildren('Habitación', grandChildren2));
      children.push(new MenuItem().newMenuItemWithChildren('Mesas', grandChildren2));
      children.push(new MenuItem().newMenuItemWithChildren('Modulares', grandChildren2));
      children.push(new MenuItem().newMenuItemWithChildren('Sillas', grandChildren2));

      this.menuItems.push(new MenuItem().newMenuItemWithChildren('Mobiliario', children));


      this.menuItems.push(new MenuItem().newMenuItem('Accesorios'));
      this.menuItems.push(new MenuItem().newMenuItem('Bar y mesa'));


      let children2 = new Array();
      children2.push(new MenuItem().newMenuItem('utensilios de cocina'));
      children2.push(new MenuItem().newMenuItem('cubiertos'));
      children2.push(new MenuItem().newMenuItem('cuchillos'));
      this.menuItems.push(new MenuItem().newMenuItemWithChildren('Cocina', children2));

      this.menuItems.push(new MenuItem().newMenuItem('Fragancias y velas'));
      this.menuItems.push(new MenuItem().newMenuItem('Gadgets'));
      this.menuItems.push(new MenuItem().newMenuItem('Iliminación'));
      this.menuItems.push(new MenuItem().newMenuItem('Libros'));
      this.menuItems.push(new MenuItem().newMenuItem('Regalos'));
    }
}
