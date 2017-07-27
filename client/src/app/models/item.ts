export class Item {
  //public name: string;
  public itemcode: string;
  public shortitemcode: string;
  //public refProveedor: string;
  public itemname: string;
  public description: string;
  public model: string;
  public newFrom: Date;
  public active: boolean;
  public dimensions: {
    depth: number,
    height: number,
    width: number
  };
  public weight: number;
  public price: number;
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

  constructor() {

  }

  public newItem(itemcode, itemname, price) {
    let item = new Item();
    item.itemname = itemname;
    item.itemcode = itemcode;
    item.price = price;
    return item;
  }
}
