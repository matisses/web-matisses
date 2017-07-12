export class Item {
  public codigo: string;
  public name: string;
  public referencia: string;
  public refCorta: string;
  public refProveedor: string;
  public nombre: string;
  public descripcion: string;
  public modelo: string;
  public fechaNuevo: Date;
  public activo: boolean;
  public dimensiones: {
      alto: number,
      ancho: number,
      profundo: number
  };
  public peso: number;
  public precio: number;
  public subgrupo: string;

  constructor(){

  }

  public newItem(codigo, nombre, precio){

    let item = new Item();
    item.nombre = nombre;
    item.codigo = codigo;
    item.precio = precio;
    return item;
  }
}
