export class Item {
  public _id: string;
  //public name: string;
  public itemcode: string;
  public shortitemcode: string;
  //public refProveedor: string;
  public itemname: string;
  public description: string;
  public availablestock: number;
  public model: string;
  public newFrom: Date;
  public active: boolean;
  public selectedQuantity: number;
  public dimensions: {
    depth: number,
    height: number,
    width: number
  };
  public weight: number;
  public priceAfterVAT: number;
  public priceBeforeVAT: number;
  public department: {
    code: string,
    name: string
  };
  public group: {
    code: string,
    name: string
  };
  public subgroup: {
    code: string,
    name: string
  };
  public stock: Array<any>;
  public images: Array<string>;
  public color: Array<any>;

  constructor() {

  }

  public newItem(itemcode, itemname, price) {
    this.itemname = itemname;
    this.itemcode = itemcode;
    this.shortitemcode = this.itemcode.substring(0, 3) + this.itemcode.substring(16);
    this.priceAfterVAT = price;
    return this;
  }

  public newItemCarrito(itemcode, itemname, price, quantity) {
    this.itemname = itemname;
    this.itemcode = itemcode;
    this.shortitemcode = this.itemcode.substring(0, 3) + this.itemcode.substring(16);
    this.priceAfterVAT = price;
    this.selectedQuantity = quantity;
    return this;
  }
}
