import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { CrockeryService } from '../../services/crockery.service';
import { Item } from '../../models/item';
import { Vajilla } from '../../models/crockery';
import { CarritoSimpleComponent } from '../header/menu/carrito/carrito-simple.component';

declare var $: any;

@Component({
  templateUrl: 'vajilla.html',
  styleUrls: ['vajilla.component.css'],
  providers: [ItemService, CrockeryService]
})

export class VajillaComponent implements OnInit {
  @ViewChild(CarritoSimpleComponent)
  private carrito: CarritoSimpleComponent;
  public cantidadSeleccionada: number = 1;
  public itemsXPag: string;
  public orderByStr: string;
  public messageError: string;
  public messageExit: string;
  public valid: boolean = true;
  public vajilla: Vajilla;
  public pages: Array<number>;
  public marcas: Array<any>;
  public colecciones: Array<any>;
  public itemsColeccion: Array<Item>;
  public vajillas: Array<Vajilla>;
  private itemsSeleccionados: Map<String, Item>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _itemService: ItemService, private _crockeryService: CrockeryService) {
    this.itemsSeleccionados = new Map<String, Item>();
    this.vajillas = new Array<Vajilla>();
    this.pages = new Array<number>();
    this.limpiarFormulario();
    this.itemsXPag = '12 x pag';
    this.orderByStr = 'Nuevos';
    this.messageExit = '';
    this.messageError = '';
  }

  ngOnInit() {
    this.cargarMarcas();
    this.cargarVajillas();
  }

  private cargarMarcas() {
    this.marcas = new Array<any>();
    this._itemService.listBrands().subscribe(
      response => {
        for (let i = 0; i < response.length; i++) {
          this.marcas.push(response[i].brand);
        }
      }, error => { console.error(error); }
    );
  }

  private cargarVajillas() {
    this._crockeryService.list().subscribe(
      response => {
        console.log(response);
        this.vajillas = response;
      }, error => { console.error(error); }
    );
  }

  public cargarColecciones() {
    this._itemService.listCollections(this.vajilla.brand).subscribe(
      response => {
        this.colecciones = response.sort();
      }, error => { console.error(error); }
    );
  }

  public cargarProductos() {
    let queryStr: string = encodeURI('?collection=' + this.vajilla.coleccion + '&brand=' + this.vajilla.brand + '&pageSize=1000')
    this._itemService.filter(queryStr).subscribe(
      response => {
        this.itemsColeccion = response.result;
      }, error => { console.error(error); }
    );
  }

  public reducirCantidad(index) {
    if (this.itemsColeccion[index].selectedQuantity && this.itemsColeccion[index].selectedQuantity > 0) {
      this.itemsColeccion[index].selectedQuantity--;
      if (this.itemsColeccion[index].selectedQuantity === 0) {
        this.itemsSeleccionados.delete(this.itemsColeccion[index].shortitemcode);
      }
      this.calcularIndicadores();
    }
  }

  public aumentarCantidad(index) {
    if (this.itemsColeccion[index].selectedQuantity) {
      if (this.itemsColeccion[index].selectedQuantity < this.itemsColeccion[index].availablestock) {
        this.itemsColeccion[index].selectedQuantity++;
      }
    } else {
      this.itemsColeccion[index].selectedQuantity = 1;
    }
    this.itemsSeleccionados.set(this.itemsColeccion[index].shortitemcode, this.itemsColeccion[index]);
    this.calcularIndicadores();
  }

  private calcularIndicadores() {
    this.vajilla.price = 0;
    this.vajilla.pieces = 0;
    this.vajilla.items = 0;
    this.itemsSeleccionados.forEach((value, key, map) => {
      this.vajilla.items++;
      this.vajilla.price = Number(this.vajilla.price) + Number(value.selectedQuantity * value.priceaftervat);
      this.vajilla.pieces += value.selectedQuantity;
    });

    this.vajilla.priceTxt = Number(this.vajilla.price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    this.vajilla.priceTxt = this.vajilla.priceTxt.substring(0, this.vajilla.priceTxt.length - 3);
  }

  public guardarVajilla(ModalForm) {
    this.valid = true;
    if (!this.vajilla.name || this.vajilla.name.length === 0 || !this.vajilla.brand || !this.vajilla.coleccion || this.vajilla.items === 0) {
      console.error('Debes llenar todos los campos obligatorios para poder proceder con la creación.');
      this.messageError = 'Debes llenar todos los campos obligatorios para poder proceder con la creación.';
      this.valid = false;
      return;
    }
    this.vajilla.detail = new Array<any>();
    this.itemsSeleccionados.forEach((value, key, map) => {
      let item = {
        itemcode: value.itemcode,
        quantity: value.selectedQuantity
      };
      this.vajilla.detail.push(item);
    });
    this._crockeryService.create(this.vajilla).subscribe(
      response => {
        console.log('vajilla creada con exito. ');
        this.messageExit = 'Vajilla creada con éxito.';
        this.refreshModal(ModalForm);
        this.cargarVajillas();
        $('#modalEditar').modal('hide');
      }, error => {
        console.error(error);
        this.messageError = 'Se produjo un error interno. Por favor inténtalo más tarde.';
      }
    );
  }

  private limpiarFormulario() {
    this.vajilla = new Vajilla();
    this.itemsColeccion = new Array<Item>();
    this.vajilla.brand = '';
    this.vajilla.coleccion = '';
    this.vajilla.pieces = 0;
    this.vajilla.price = 0;
    this.vajilla.priceTxt = '0';
    this.vajilla.items = 0;
    this.messageError = '';
  }

  public refreshModal(ModalForm) {
    ModalForm.reset();
    this.limpiarFormulario();
  }

  public mostrarVajilla(vajilla) {
    console.log(vajilla);
    this.vajilla = vajilla;
    this._crockeryService.listItems(vajilla._id).subscribe(
      response => {
        this.vajilla.detail = new Array<any>();
        for (let i = 0; i < response.length; i++) {
          this.vajilla.detail.push(response[i].item);
        }
      }, error => { console.error(error); }
    );
    $('#modalVajillas').modal('show');
  }

  public eliminarVajilla(vajilla) {
    console.log('Eliminando vajilla ' + vajilla._id);
    this._crockeryService.remove(vajilla._id).subscribe(
      response => {
        this.cargarVajillas();
      }, error => { console.error(error); }
    );
    console.log('Vajilla eliminada');
    this.messageExit = 'Vajilla eliminada con éxito.';
  }

  private compareItems(a, b) {
    return a.priceaftervat - b.priceaftervat;
  }

  public agregarCarrito() {
    console.log('Agregando al carrito la vajilla');
    console.log(this.vajilla.detail);
    for (let i = 0; i < this.vajilla.detail.length; i++) {
      console.log('vajilla ' + this.vajilla.detail[i].itemcode);
      console.log('vajilla ' + this.vajilla.detail[i].selectedQuantity);
      this.carrito.procesarItem(this.vajilla.detail[i]);
    }
  }
}
