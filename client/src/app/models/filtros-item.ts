export class FiltroItem {
  public _id: string;
  public codigo: string;
  public nombre: string;
  public hexa: string;
  public route: string;

  constructor() {

  }

  public newMenuItem(codigo, nombre) {
    let menuItem = new FiltroItem();
    menuItem.codigo = codigo;
    menuItem.nombre = nombre;
    return menuItem;
  }

  public newMarcaItem(codigo, nombre) {
    let marcaItem = new FiltroItem();
    marcaItem.codigo = codigo;
    marcaItem.nombre = nombre;
    return marcaItem;
  }

  public newMaterialesItem(codigo, nombre) {
    let materialesItem = new FiltroItem();
    materialesItem.codigo = codigo;
    materialesItem.nombre = nombre;
    return materialesItem;
  }

  public newColorItem(codigo, nombre, hexa) {
    let colorItem = new FiltroItem();
    colorItem.codigo = codigo;
    colorItem.nombre = nombre;
    colorItem.hexa = hexa;
    return colorItem;
  }

}
