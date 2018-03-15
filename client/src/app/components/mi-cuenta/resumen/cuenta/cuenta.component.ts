import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Customer } from '../../../../models/customer';
import { SessionUsuarioService } from '../../../../services/session-usuario.service';
import { CustomerService } from '../../../../services/customer.service';
import { CityService } from '../../../../services/city.service';


//declare var jquery: any;
declare var $: any;

@Component({
  selector: 'matisses-cuenta',
  templateUrl: 'cuenta.html',
  styleUrls: ['cuenta.component.css'],
  providers: [CustomerService, CityService,SessionUsuarioService]
})


export class CuentaComponent implements OnInit {
  public nombreUsuario: string;
  public correoUsuario: string;
  public celularUsuario: string;
  public telefonoUsuario: string;
  public direccionUsuario: string;
  public newsUsuario: string;
  public ajustesCuenta: boolean = false;
  public messageError: string;
  public cambiosGuardados: boolean = false;
  public customer: any;
  public documentCustomer:string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _customerService: CustomerService,private _userService: SessionUsuarioService) {
    this.nombreUsuario = 'Alejandro Guerra';
    this.correoUsuario = 'agp1011@hotmail.com';
    this.celularUsuario = '3004281100';
    this.telefonoUsuario = '4185158';
    this.direccionUsuario = 'Carrera 60 # 75AA sur - 75 Casa 239';
    this.newsUsuario = 'Estás inscrito al newsletter';
    this.messageError = '';
    //this.customer = new Customer();
  }

  ngOnInit() {
    this.documentCustomer=localStorage.getItem('doc-customer');
    this.nombreUsuario=localStorage.getItem('nombre-usuario');
    this.buscarCliente();
  }

  ngAfterViewInit() {
    console.log(' entra en el after ');
  }

  public editarCuenta() {
    this.ajustesCuenta = true;
  }

  public salirEditarCuenta() {
    this.ajustesCuenta = false;
  }

  public guardarCambios() {
    this.cambiosGuardados = true;
    this.messageError = 'Los ajustes fueron guardados exitosamente.';
  }

  public buscarCliente() {
console.log('buscar cliente '+this.nombreUsuario);
if (this.nombreUsuario != null && this.nombreUsuario.length > 0) {
  this._userService.cargarcliente(this.nombreUsuario).subscribe(
    response => {
      this.customer = response;
      console.log('sl socio '+this.customer.BPAddresses.BPAddress.length);
      //this.customer = response;
    },
    error => {
      console.error(error);
    }
  );
}
    // if (this.documentCustomer != null && this.documentCustomer.length > 0) {
    //   this._customerService.getCustomerData(this.documentCustomer).subscribe(
    //     response => {
    //       if (response.fiscalIdType == '31') {
    //         this.messageError = 'Tu tipo de documento no está habilitado actualmente para realizar compras en el sitio web.';
    //
    //         return;
    //       }
    //       this.customer = response;
    //     },
    //     error => {
    //       console.error(error);
    //     }
    //   );
    // }
  }

}
