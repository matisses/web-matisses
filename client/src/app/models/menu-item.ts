export class MenuItem {
  public nombre: string;
  public children:Array<MenuItem>;

  constructor(){

  }

  public newMenuItem(nombre){
    let menuItem = new MenuItem();
    menuItem.nombre = nombre;
    return menuItem;
  }

  public newMenuItemWithChildren(nombre:string, children:Array<MenuItem>){
    let menuItem = new MenuItem();
    menuItem.nombre = nombre;
    menuItem.children = children;
    return menuItem;
  }

}
