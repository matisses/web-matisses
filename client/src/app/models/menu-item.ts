export class MenuItem {
  public codigo: string;
  public nombre: string;
  public children:Array<MenuItem>;

  constructor(){

  }

  public newMenuItem(codigo, nombre){
    let menuItem = new MenuItem();
    menuItem.codigo = codigo;
    menuItem.nombre = nombre;
    return menuItem;
  }

  public newMenuItemWithChildren(codigo:string, nombre:string, children:Array<MenuItem>){
    let menuItem = new MenuItem();
    menuItem.codigo = codigo;
    menuItem.nombre = nombre;
    menuItem.children = children;
    return menuItem;
  }

}
