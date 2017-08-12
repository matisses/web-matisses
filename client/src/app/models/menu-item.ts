export class MenuItem {
  public _id: string;
  public name: string;
  public department: string;
  public group: string;
  public subgroup: string;
  public parentId: string;
  public position: number;
  public menuItemAfter: String;
  public menuItemBefore: String;
  public children: Array<MenuItem>;

  constructor() {
    this.children = new Array<MenuItem>();
  }

  public newMenuItem(group: string, subgroup: string, name: string) {
    this.group = group;
    this.subgroup = subgroup;
    this.name = name;
    return this;
  }

  public newMenuItemWithChildren(group: string, subgroup: string, name: string, children: Array<MenuItem>) {
    this.group = group;
    this.subgroup = subgroup;
    this.name = name;
    this.children = children;
    return this;
  }
}
