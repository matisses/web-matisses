export class City {
  public _id: string;
  public code: string;
  public name: string;
  public state: string;

  constructor() {
  }

  public newCity(_id, code, name, state) {
    this._id = _id;
    this.code = code;
    this.name = name;
    this.state = state;
    return this;
  }
}
