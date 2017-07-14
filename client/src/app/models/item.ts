export class Item {
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

  public newItem(referencia, nombre, precio){

    let item = new Item();
    item.nombre = nombre;
    item.referencia = referencia;
    item.precio = precio;
    return item;
  }
}
