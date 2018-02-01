export class DatosPagoPlaceToPay {
  public buyer: {
    document: string,
    name: string,
    surname: string,
    documentType: string,
    email: string,
    mobile: string,
    address: {
      street: string,
      city: string,
      country: string
    }
  };
  public locale: string;
  public userAgent: string;
  public payment: {
    allowPartial: string,
    reference: string,
    description: string,
    amount: {
      currency: string,
      total: number,
      taxes: {
        kind: string,
        amount: number
      }
    }
  };
  public auth: {
    login: string,
    seed: string,
    nonce: string,
    tranKey: string
  };
  public expiration: string;
  public returnUrl: string;
  public ipAddress: string;
  public codigoLista: string;

  constructor() {
  }

  public newDatosPagoPlaceToPayLista(
    buyer: { document: string, name: string, surname: string, documentType: string, email: string, mobile: string, address: { street: string, city: string, country: string } },
    locale: string,
    userAgent: string,
    payment: { allowPartial: string, reference: string, description: string, amount: { currency: string, total: number, taxes: { kind: string, amount: number } } },
    auth: { login: string, seed: string, nonce: string, tranKey: string },
    expiration: string,
    returnUrl: string,
    ipAddress: string,codigoLista:string) {
    this.buyer = buyer;
    if (locale != null) {
      this.locale = locale;
    }
    this.userAgent = userAgent;
    this.payment = payment;
    this.auth = auth;
    this.expiration = expiration;
    this.returnUrl = returnUrl;
    this.ipAddress = ipAddress;
    this.codigoLista=codigoLista;

    return this;
  }

  public newDatosPagoPlaceToPay(
    buyer: { document: string, name: string, surname: string, documentType: string, email: string, mobile: string, address: { street: string, city: string, country: string } },
    locale: string,
    userAgent: string,
    payment: { allowPartial: string, reference: string, description: string, amount: { currency: string, total: number, taxes: { kind: string, amount: number } } },
    auth: { login: string, seed: string, nonce: string, tranKey: string },
    expiration: string,
    returnUrl: string,
    ipAddress: string) {
    this.buyer = buyer;
    if (locale != null) {
      this.locale = locale;
    }
    this.userAgent = userAgent;
    this.payment = payment;
    this.auth = auth;
    this.expiration = expiration;
    this.returnUrl = returnUrl;
    this.ipAddress = ipAddress;


    return this;
  }
}
