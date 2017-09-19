export class Vajilla {

  public _id: string;
  public name: string;
  public brand: string;
  public coleccion: string;
  public photo: string;
  public priceTxt: string;
  public price: number;
  public items: number;
  public pieces: number;
  public detail: Array<any>;

  constructor() {
    this.detail = new Array<any>();
  }
}
