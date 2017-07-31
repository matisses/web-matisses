export class Customer {
  public cardCode: string;
  public cardName: string;
  public birthDate: Date;
  public defaultShippingAddress: string;
  public defaultBillingAddress: string;
  public firstName: string;
  public lastName1: string;
  public lastName2: string;
  public fiscalIdType: string;
  public fiscalID: string;
  public selfRetainer: string;
  public salesPersonCode: number;
  public cardType: string;
  public foreignType: string;
  public gender: string;
  public nationality: string;
  public personType: string;
  public taxRegime: string;
  public addresses: [{
    stateCode: number,
    stateName: string,
    cityCode: number,
    cityName: string,
    addressName: string,
    addressType: string,
    address: string,
    landLine: string,
    cellphone: string,
    email: string,
    country: string,
    taxCode: string
  }];

  constructor() {
    this.addresses = [{
      stateCode: null,
      stateName: null,
      cityCode: null,
      cityName: null,
      addressName: null,
      addressType: null,
      address: null,
      landLine: null,
      cellphone: null,
      email: null,
      country: null,
      taxCode: null
    }];
  }

  public newCustomer(cardCode, cardName, birthDate, defaultShippingAddress, defaultBillingAddress, firstName, lastName1, lastName2, fiscalIdType, fiscalID, selfRetainer, salesPersonCode,
    cardType, foreignType, gender, nationality, personType, taxRegime, addresses) {
    this.cardCode = cardCode;
    this.cardName = cardName;
    this.birthDate = birthDate;
    this.defaultShippingAddress = defaultShippingAddress;
    this.defaultBillingAddress = defaultBillingAddress;
    this.firstName = firstName;
    this.lastName1 = lastName1;
    this.lastName2 = lastName2;
    this.fiscalIdType = fiscalIdType;
    this.fiscalID = fiscalID;
    this.selfRetainer = selfRetainer;
    this.salesPersonCode = salesPersonCode;
    this.cardType = cardType;
    this.foreignType = foreignType;
    this.gender = gender;
    this.nationality = nationality;
    this.personType = personType;
    this.taxRegime = taxRegime;
    this.addresses = addresses;
    return this;
  }
}
