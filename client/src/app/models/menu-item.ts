export class MenuItem {
  public _id: string;
  public codigo: string;
  public nombre: string;
  public route: string;
  public children:Array<MenuItem>;

  constructor(){
    this.children = new Array<MenuItem>();
  }

  public newMenuItem(codigo, nombre){
    let menuItem = new MenuItem();
    menuItem.codigo = codigo;
    menuItem.nombre = nombre;
    return menuItem;
  }

  public newMenuItemWithRoute(id, codigo, nombre, route){
    let menuItem = new MenuItem();
    menuItem._id = id;
    menuItem.codigo = codigo;
    menuItem.nombre = nombre;
    menuItem.route = route;
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
