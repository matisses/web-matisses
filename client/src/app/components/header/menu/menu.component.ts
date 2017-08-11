import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { StickyMenuDirective } from '../../../directives/sticky.directive';
import { MenuItem } from '../../../models/menu-item';
import { CarritoComponent } from './carrito/carrito.component';

import { MenuItemService } from '../../../services/menu.service';
import { JWTService } from '../../../services/jwt.service';

declare var $: any;

@Component({
  selector: 'matisses-menu',
  templateUrl: 'menu.html',
  styleUrls: ['menu.component.css'],
  providers: [MenuItemService, JWTService],
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
  @ViewChild(CarritoComponent)
  public carrito: CarritoComponent;
  public menuItems: Array<MenuItem>;
  public padreSeleccionado: MenuItem;
  public state: string = 'hidden';
  public stateOverlay: string = 'hidden';
  private viewportWidth: number = 0;
  public adminToken: string;
  public errorMessage: string = '';

  public mensajeConfirmacion: string = '';
  public metodoEliminar: string = '';
  public confirmacion: boolean = false;
  public removeCategoria: boolean = false;
  public removeGrupo: boolean = false;
  public categoriaSeleccionada: MenuItem;
  public grupoSeleccionado: MenuItem;
  public subgrupoSeleccionado: MenuItem;
  public categorias: Array<MenuItem>;
  public grupos: Array<MenuItem>;
  public subgrupos: Array<MenuItem>;

  constructor(private _jwt: JWTService, private _menuService: MenuItemService, private _route: ActivatedRoute, private _router: Router) {
    this.padreSeleccionado = new MenuItem();
  }

  ngOnInit() {
    this.inicializarMenu();
    document.getElementById("myNav").style.width = "0%";
    this.cargarDatosMenu();
  }

  ngAfterViewInit() {
    this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

  private cargarDatosMenu() {
    this._menuService.listMenuRecursively(null).subscribe(
      response => {
        this.categorias = response.result;
        if (!this.categoriaSeleccionada) {
          this.categoriaSeleccionada = this.categorias[0];
        }

        this.grupoSeleccionado = null;
        this.seleccionarCategoria(this.categoriaSeleccionada, true);
      },
      error => {
        console.error(error);
      }
    );
  }

  public seleccionarCategoria(categoria, actualizarGrupo: boolean) {
    this.categoriaSeleccionada = categoria;

    if (this.categoriaSeleccionada == null) {
      this.categoriaSeleccionada = new MenuItem().newMenuItem('', '', '');
      this.grupos = null;
    } else {
      if (this.categoriaSeleccionada != null && this.categoriaSeleccionada._id != null && this.categoriaSeleccionada._id.length > 0) {
        this._menuService.listMenuRecursively(this.categoriaSeleccionada._id).subscribe(
          response => {
            this.grupos = response.result;

            if (this.grupos == null || this.grupos.length <= 0) {
              this.seleccionarGrupo(null, true);
            } else {
              if (!this.grupoSeleccionado || actualizarGrupo) {
                this.grupoSeleccionado = this.grupos[0];
                this.seleccionarGrupo(this.grupoSeleccionado, true);
              }
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  public seleccionarGrupo(grupo, actualizarSubgrupo: boolean) {
    console.log('---------------------------------');
    this.grupoSeleccionado = grupo;
    this.subgrupos = null;
    this.subgrupoSeleccionado = null;

    if (!this.grupoSeleccionado || this.grupos == null || this.grupos.length <= 0) {
      this.grupoSeleccionado = new MenuItem().newMenuItem('', '', '');
    } else {
      if (this.grupoSeleccionado != null && this.grupoSeleccionado._id != null && this.grupoSeleccionado._id.length > 0) {
        this._menuService.listMenuRecursively(this.grupoSeleccionado._id).subscribe(
          response => {
            this.subgrupos = response.result;

            if (this.subgrupos == null || this.subgrupos.length <= 0) {
              this.seleccionarSubgrupo(null);
            } else {
              if (!this.subgrupoSeleccionado || actualizarSubgrupo) {
                this.subgrupoSeleccionado = this.subgrupos[0];
                this.seleccionarSubgrupo(this.subgrupoSeleccionado);
              }
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  public seleccionarSubgrupo(subgrupo) {
    this.subgrupoSeleccionado = subgrupo;

    if (!this.subgrupoSeleccionado || this.subgrupos == null || this.subgrupos.length <= 0) {
      this.subgrupoSeleccionado = new MenuItem().newMenuItem('', '', '');
    } else {
      //this.seleccionarGrupo(this.grupoSeleccionado, true);
    }
  }

  public guardarCategoria() {
    this.errorMessage = '';
    if (this.categoriaSeleccionada.name == null || this.categoriaSeleccionada.name.length <= 0) {
      this.errorMessage = 'Debe llenar todos los datos para guardar la categoria';
      return;
    }
    if (this.categoriaSeleccionada && this.categoriaSeleccionada._id && this.categoriaSeleccionada._id.length > 0) {
      this.actualizarMenuItem(true, false, false, this.categoriaSeleccionada);
    } else {
      let menuItemBefore;
      if (this.categorias.length >= 1) {
        menuItemBefore = this.categorias[this.categorias.length - 1]._id;
      } else {
        menuItemBefore = null;
      }

      let itemMenu = {
        name: this.categoriaSeleccionada.name,
        route: '',
        parentId: null,
        menuItemBefore: menuItemBefore,
        menuItemAfter: null
      }

      this._menuService.save(itemMenu).subscribe(
        response => {
          this.categoriaSeleccionada = new MenuItem().newMenuItem('', '', '');

          if (this.categorias.length > 0) {
            //Se debe a mandar a actualizar el ultimo item del menu, para que tome como siguiente item el nuevo
            this.categorias[this.categorias.length - 1].menuItemAfter = response.menuItem._id;
            this.actualizarMenuItem(true, false, false, this.categorias[this.categorias.length - 1]);
          } else {
            this.inicializarMenu();
            this.cargarDatosMenu();
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public guardarGrupo() {
    this.errorMessage = '';
    if (this.grupoSeleccionado.group == null || this.grupoSeleccionado.group.length <= 0 || this.grupoSeleccionado.name == null || this.grupoSeleccionado.name.length <= 0) {
      this.errorMessage = 'Debe llenar todos los datos para guardar el grupo';
      return;
    }
    if (this.grupoSeleccionado && this.grupoSeleccionado._id && this.grupoSeleccionado._id.length > 0) {
      this.actualizarMenuItem(false, true, false, this.grupoSeleccionado);
    } else {
      let menuItemBefore;
      if (this.grupos.length >= 1) {
        menuItemBefore = this.grupos[this.grupos.length - 1]._id;
      } else {
        menuItemBefore = null;
      }

      let itemMenu = {
        group: this.grupoSeleccionado.group,
        name: this.grupoSeleccionado.name,
        route: '',
        parentId: this.categoriaSeleccionada._id,
        menuItemBefore: menuItemBefore,
        menuItemAfter: null
      }

      console.log(itemMenu);

      this._menuService.save(itemMenu).subscribe(
        response => {
          this.grupoSeleccionado = new MenuItem().newMenuItem('', '', '');

          if (this.grupos.length > 0) {
            this.grupos[this.grupos.length - 1].menuItemAfter = response.menuItem._id;
            this.actualizarMenuItem(false, true, false, this.grupos[this.grupos.length - 1]);
          }
          this.seleccionarCategoria(this.categoriaSeleccionada, true);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public guardarSubgrupo() {
    this.errorMessage = '';
    if (this.subgrupoSeleccionado.subgroup == null || this.subgrupoSeleccionado.subgroup.length <= 0 || this.subgrupoSeleccionado.name == null || this.subgrupoSeleccionado.name.length <= 0) {
      this.errorMessage = 'Debe llenar todos los datos para guardar el subgrupo';
      return;
    }
    if (this.subgrupoSeleccionado && this.subgrupoSeleccionado._id && this.subgrupoSeleccionado._id.length > 0) {
      this.actualizarMenuItem(false, false, true, this.subgrupoSeleccionado);
    } else {
      let menuItemBefore;
      if (this.subgrupos.length >= 1) {
        menuItemBefore = this.subgrupos[this.subgrupos.length - 1]._id;
      } else {
        menuItemBefore = null;
      }

      let itemMenu = {
        subgroup: this.subgrupoSeleccionado.subgroup,
        group: this.grupoSeleccionado.group,
        name: this.subgrupoSeleccionado.name,
        route: '',
        parentId: this.grupoSeleccionado._id,
        menuItemBefore: menuItemBefore,
        menuItemAfter: null
      }

      console.log(itemMenu);

      this._menuService.save(itemMenu).subscribe(
        response => {
          this.subgrupoSeleccionado = new MenuItem().newMenuItem('', '', '');

          if (this.subgrupos.length > 0) {
            this.subgrupos[this.subgrupos.length - 1].menuItemAfter = response.menuItem._id;
            this.actualizarMenuItem(false, false, true, this.subgrupos[this.subgrupos.length - 1]);
          }
          this.seleccionarGrupo(this.grupoSeleccionado, true);
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  public subirPosicionCategoria() {
    this.moverPosicionUp(true, false, false, this.categoriaSeleccionada, this.categorias);
  }

  public bajarPosicionCategoria() {
    this.moverPosicionDown(true, false, false, this.categoriaSeleccionada, this.categorias);
  }

  public subirPosicionGrupo() {
    this.moverPosicionUp(false, true, false, this.grupoSeleccionado, this.grupos);
  }

  public bajarPosicionGrupo() {
    this.moverPosicionDown(false, true, false, this.grupoSeleccionado, this.grupos);
  }

  public subirPosicionSubgrupo() {
    this.moverPosicionUp(false, false, true, this.subgrupoSeleccionado, this.subgrupos);
  }

  public bajarPosicionSubgrupo() {
    this.moverPosicionDown(false, false, true, this.subgrupoSeleccionado, this.subgrupos);
  }

  private moverPosicionUp(actualizarCategorias: boolean, actualizarGrupos, actualizarSubgrupos: boolean, item: MenuItem, menuItem: Array<MenuItem>) {
    for (let i = 0; i < menuItem.length; i++) {
      if (menuItem[i]._id === item._id) {
        if (i > 0) {
          if (i == 1) {
            menuItem[i].menuItemBefore = null;
            menuItem[i].menuItemAfter = menuItem[i - 1]._id;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i]);

            menuItem[i - 1].menuItemBefore = menuItem[i]._id;
            if (menuItem.length > 2) {
              menuItem[i - 1].menuItemAfter = menuItem[i + 1]._id;
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 1]);
            } else {
              menuItem[i - 1].menuItemAfter = null;
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 1]);
            }

            if (menuItem.length > 2) {
              menuItem[i + 1].menuItemBefore = menuItem[i - 1]._id;
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i + 1]);
            }
          } else if (menuItem.length == 2) {
            menuItem[i].menuItemBefore = null;
            menuItem[i].menuItemAfter = menuItem[i - 1]._id;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i]);

            menuItem[i - 1].menuItemBefore = menuItem[i]._id;
            menuItem[i - 1].menuItemAfter = null;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 1]);
          } else {
            menuItem[i].menuItemBefore = menuItem[i - 2]._id;
            menuItem[i].menuItemAfter = menuItem[i - 1]._id;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i]);

            menuItem[i - 2].menuItemAfter = menuItem[i]._id;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 2]);

            menuItem[i - 1].menuItemBefore = menuItem[i]._id;
            if ((menuItem.length - 1) > i) {
              menuItem[i - 1].menuItemAfter = menuItem[i + 1]._id;
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 1]);
            } else {
              menuItem[i - 1].menuItemAfter = null;
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 1]);
            }

            if ((menuItem.length - 1) > i) {
              menuItem[i + 1].menuItemBefore = menuItem[i - 1]._id;
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i + 1]);
            }
          }
        }
        break;
      }
    }
  }

  public moverPosicionDown(actualizarCategorias: boolean, actualizarGrupos, actualizarSubgrupos: boolean, item: MenuItem, menuItem: Array<MenuItem>) {
    for (let i = 0; i < menuItem.length; i++) {
      if (menuItem[i]._id === item._id) {
        if (i < (menuItem.length - 1)) {
          if (i == (menuItem.length - 2)) {
            menuItem[i].menuItemBefore = menuItem[i + 1]._id;
            menuItem[i].menuItemAfter = null;
            this.actualizarMenuItem(false, false, false, menuItem[i]);

            menuItem[i + 1].menuItemAfter = menuItem[i]._id;
            if (menuItem.length > 2) {
              menuItem[i + 1].menuItemBefore = menuItem[i - 1]._id;
              this.actualizarMenuItem(false, false, false, menuItem[i + 1]);

              menuItem[i - 1].menuItemAfter = menuItem[i + 1]._id;
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 1]);
            } else {
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i + 1]);
            }
          } else if (menuItem.length == 2) {
            menuItem[i].menuItemBefore = menuItem[i + 1]._id;
            menuItem[i].menuItemAfter = null;
            this.actualizarMenuItem(false, false, false, menuItem[i]);

            menuItem[i + 1].menuItemAfter = menuItem[i]._id;
            menuItem[i + 1].menuItemBefore = null;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i + 1]);
          } else {
            menuItem[i].menuItemBefore = menuItem[i + 1]._id;
            menuItem[i].menuItemAfter = menuItem[i + 2]._id;
            this.actualizarMenuItem(false, false, false, menuItem[i]);

            menuItem[i + 1].menuItemAfter = menuItem[i]._id;
            if (i == 0) {
              menuItem[i + 1].menuItemBefore = null;
            } else {
              menuItem[i + 1].menuItemBefore = menuItem[i - 1]._id;
            }

            if (menuItem.length > 2) {
              menuItem[i + 2].menuItemBefore = menuItem[i]._id;
              this.actualizarMenuItem(false, false, false, menuItem[i + 2]);

              menuItem[i - 1].menuItemAfter = menuItem[i + 1]._id;
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 1]);
            } else {
              this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i + 1]);
            }
          }
        }
        break;
      }
    }
  }

  public eliminarCategoria(confirmacion: boolean) {
    this.errorMessage = '';
    this.grupos = null;
    this.grupoSeleccionado = null;
    this.subgrupos = null;
    this.subgrupoSeleccionado = null;
    if (this.grupos != null && this.grupos.length > 0) {
      this.errorMessage = 'La categoria ' + this.categoriaSeleccionada.name + ' tiene grupos asociados y por lo tanto no se puede eliminar.';
      return
    }
    if (!confirmacion) {
      this.removeCategoria = true;
      this.mensajeConfirmacion = '¿Esta seguro que desea eliminar la categoria ' + this.categoriaSeleccionada.name + '?.';
      this.confirmacion = true;
    } else {
      this._menuService.remove(this.categoriaSeleccionada._id).subscribe(
        response => {
          this.eliminarItemMenu(true, false, false, this.categoriaSeleccionada, this.categorias);
          this.categoriaSeleccionada = null;
          this.confirmacion = false;
          this.removeCategoria = false;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public eliminarGrupo(confirmacion: boolean) {
    this.errorMessage = '';
    /*if (this.grupos != null && this.grupos.length > 0) {
      this.errorMessage = 'La categoria ' + this.categoriaSeleccionada.name + ' tiene grupos asociados y por lo tanto no se puede eliminar.';
      return
    }*/
    if (!confirmacion) {
      this.removeGrupo = true;
      this.mensajeConfirmacion = '¿Esta seguro que desea eliminar el grupo ' + this.grupoSeleccionado.name + '?.';
      this.confirmacion = true;
    } else {
      this._menuService.remove(this.grupoSeleccionado._id).subscribe(
        response => {
          this.eliminarItemMenu(false, true, false, this.grupoSeleccionado, this.grupos);
          this.grupoSeleccionado = null;
          this.confirmacion = false;
          this.removeGrupo = false;
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  private eliminarItemMenu(actualizarCategorias: boolean, actualizarGrupos, actualizarSubgrupos: boolean, item: MenuItem, menuItem: Array<MenuItem>) {
    for (let i = 0; i < menuItem.length; i++) {
      if (menuItem[i]._id === item._id) {
        if (i < (menuItem.length - 1)) {
          if (i != 0) {
            menuItem[i - 1].menuItemAfter = menuItem[i + 1]._id;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 1]);

            menuItem[i + 1].menuItemBefore = menuItem[i - 1]._id;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i + 1]);
          } else {
            menuItem[i + 1].menuItemBefore = null;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i + 1]);
          }
        } else {
          if (i != 0) {
            menuItem[i - 1].menuItemAfter = null;
            this.actualizarMenuItem(actualizarCategorias, actualizarGrupos, actualizarSubgrupos, menuItem[i - 1]);
          }
        }
      }
    }
  }

  public alternarSeleccionPadre(padreSeleccionado) {
    if (this.padreSeleccionado._id != null && this.padreSeleccionado._id === padreSeleccionado._id) {
      this.padreSeleccionado = new MenuItem();
      this.cerrarOverlay();
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

  public estaSeleccionado(codigoCategoria) {
    return this.padreSeleccionado != null && this.padreSeleccionado._id === codigoCategoria
  }

  private cargarValidarTokenAdmin() {
    this.adminToken = localStorage.getItem('matisses.admin-token');
    if (this.adminToken) {
      this._jwt.validateToken(this.adminToken).subscribe(
        response => {
          if (response.estado != 0) {
            console.error('El token del localStorage no es valido. ' + response.mensaje);
            this.adminToken = null;
            localStorage.removeItem('matisses.admin-token');
          }
        }, error => {
          console.error(error);
          this.adminToken = null;
          localStorage.removeItem('matisses.admin-token');
        }
      );
    }
  }

  private inicializarMenu() {
    this.menuItems = new Array();
    this.cargarValidarTokenAdmin();
    this._menuService.listMenuRecursively(null).subscribe(
      response => {
        for (let i = 0; i < response.result.length; i++) {
          let menuItem = new MenuItem();
          menuItem._id = response.result[i]._id;
          menuItem.name = response.result[i].name;
          menuItem.department = response.result[i].department;
          menuItem.group = response.result[i].group;
          menuItem.subgroup = response.result[i].subgroup;
          menuItem.parentId = response.result[i].parentId;
          menuItem.position = response.result[i].position;
          this.menuItems.push(menuItem);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  private cargarHijos(menuItem, esPadre) {
    this._menuService.listMenuRecursively(menuItem._id).subscribe(
      response => {
        for (let i = 0; i < response.result.length; i++) {
          let child = new MenuItem();
          child._id = response.result[i]._id;
          child.name = response.result[i].name;
          child.department = response.result[i].department;
          child.group = response.result[i].group;
          child.subgroup = response.result[i].subgroup;
          child.parentId = response.result[i].parentId;
          child.position = response.result[i].position;

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
      }, error => { console.error(error); }
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

  public cerrarNav() {
    document.getElementById("myNav").style.width = "0%";
  }

  public toggleClass(idComponent, class1, class2) {
    $(idComponent).toggleClass(class1 + " " + class2);
  }

  public openAccordion(idComponent) {
    document.getElementById("idComponent").style.display = "block";
  }

  private actualizarMenuItem(actualizarCategorias: boolean, actualizarGrupos, actualizarSubgrupos: boolean, menuItem: MenuItem) {
    this._menuService.edit(menuItem).subscribe(
      response => {
        this.inicializarMenu();
        if (actualizarCategorias) {
          this.cargarDatosMenu();
        } else if (actualizarGrupos) {
          this.seleccionarCategoria(this.categoriaSeleccionada, false);
        } else if (actualizarSubgrupos) {
          this.seleccionarGrupo(this.grupoSeleccionado, false);
        }
      }, error => {
        console.error(error);
      }
    );
  }

  /*public updateMenuItem(menuItem: MenuItem, inicializar: boolean = false) {
    this._menuService.edit(menuItem).subscribe(
      response => {
        if (inicializar) {
          this.inicializarMenu();
          this.cargarDatosMenu();
        }
      }, error => {
        console.error(error);
      }
    );
  }*/

  public crearMenuItem() {
    this._menuService.save(null).subscribe(
      response => {
        this.inicializarMenu();
        //this.nuevoMenuItem = new MenuItem();
        $("#agregarMenuItem").modal({
          backdrop: false,
          show: false
        });
      }, error => { console.error(error); }
    );
  }

  public eliminarMenuItem() {
    this._menuService.remove(null).subscribe(
      response => {
        //this.menuEditar = new MenuItem();
        this.inicializarMenu();
      }, error => { console.error(error); }
    );
  }
}
