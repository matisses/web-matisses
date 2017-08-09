export class MenuItem {
  public _id: string;
  public code: string;
  public name: string;
  public department: string;
  public group: string;
  public subgroup: string;
  public parentId: string;
  public position: number;
  public children: Array<MenuItem>;

  constructor() {
    this.children = new Array<MenuItem>();
  }

  public newMenuItem(code: string, name: string) {
    //let menuItem = new MenuItem();
    this.code = code;
    this.name = name;
    return this;
  }

  public newMenuItemWithChildren(code: string, name: string, children: Array<MenuItem>) {
    //let menuItem = new MenuItem();
    this.code = code;
    this.name = name;
    this.children = children;
    return this;
  }
}
