export class ListGift {
  public idLista: number;
  public invitados: number;
  public valorMinimoBono: number;
  public codigo: string;
  public nombre: string;
  public rutaImagenPerfil: string;
  public rutaImagenPortada: string;
  public mensajeBienvenida: string;
  public mensajeAgradecimiento: string;
  public fechaCreacion: Date;
  public fechaEvento: Date;
  public fechaEventoUTC: Date;
  public listaPrivada: boolean;
  public aceptaBonos: boolean;
  public permitirEntregaPersonal: boolean;
  public activa: boolean;
  public creator: {
    fiscalIdType: string;
    fiscalID: string;
    firstName: string;
    lastName1: string;
    lastName2: string;
    gender: string;
    notificacionInmediataCreador: string,
    notificacionDiariaCreador: string,
    notificacionSemanalCreador: string,
    notificacionCambioCategoriaCreador: string
    addresses: [{
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
    }]
  };
  public coCreator: {
    fiscalIdType: string;
    fiscalID: string;
    firstName: string;
    lastName1: string;
    lastName2: string;
    gender: string;
    notificacionInmediataCocreador: string,
    notificacionDiariaCocreador: string,
    notificacionSemanalCocreador: string,
    notificacionCambioCategoriaCocreador: string,
    addresses: [{
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
    }]
  };
  public estado: {
    idEstado: number,
    nombre: string
  };
  public tipoEvento: {
    idTipoEvento: number,
    nombre: string
  };
  public categoria: {
    idCategoria: number,
    valorMinimo: number,
    nombre: string
  };

  constructor() {
  }

  public newListGift() {
      this.idLista = null;
      this.invitados = null;
      this.valorMinimoBono = null;
      this.codigo = null;
      this.nombre = null;
      this.rutaImagenPerfil = null;
      this.rutaImagenPortada = null;
      this.mensajeBienvenida = null;
      this.fechaCreacion = null;
      this.fechaEvento = null;
      this.fechaEventoUTC = null;
      this.listaPrivada = null;
      this.aceptaBonos = null;
      this.permitirEntregaPersonal = null;
      this.activa = null;
      this.creator = null;
      this.coCreator = null;
      this.estado = null;
      this.tipoEvento = null;
      this.categoria = null;
    return this;
  }
}
