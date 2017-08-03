export class ShippingMethod {
  public code: number;
  public name: string;
  public description: string;
  public price: number;

  constructor() {
  }

  public newShippingMethod(code: number, name: string, description: string, price: number) {
    this.code = code;
    this.name = name;
    this.description = description;
    this.price = price;

    return this;
  }
}
