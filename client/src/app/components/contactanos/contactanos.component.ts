import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { SendEmailService } from '../../services/send-email.service';

declare var $: any;
declare var grecaptcha: any;

@Component({
  templateUrl: 'contactanos.html',
  styleUrls: ['contactanos.component.css'],
  providers: [SendEmailService]
})

export class ContactanosComponent implements OnInit {
  public firstName: string;
  public mail: string;
  public cellular: string;
  public phone: string;
  public subject: string;
  public message: string;
  public reCaptcha: string;
  public messageError: string;
  public messageExit: string;
  public valid: boolean = true;
  public recaptchaSiteKey = GLOBAL.recaptchaSiteKey;
  public toMail = GLOBAL.toMail;

  constructor(private _route: ActivatedRoute, private _router: Router, private _sendEmailService: SendEmailService) {
    this.messageError = '';
    this.messageExit = '';
  }

  ngOnInit() {
    console.log('inicializando componente de contactanos');
  }

  ngAfterViewInit() {
    console.log('Termino de cargar deberia subir el body')
    $(document).ready(function() {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

  public onCaptchaComplete(response: any) {
    this.reCaptcha = response.token;
  }

  public enviar() {
    this.valid = true;
    this.messageError = '';
    this.messageExit = '';
    if (this.firstName == null || this.firstName.length <= 0 ||
      this.mail == null || this.mail.length <= 0 ||
      this.subject == null || this.subject.length <= 0 ||
      this.message == null || this.message.length <= 0 ||
      !this.reCaptcha) {
      console.log('Se deben llenar todos los campos obligatorios para poder proceder con el envió');
      this.messageError = 'Se deben llenar todos los campos obligatorios para poder proceder con el envió.';
      this.valid = false;
      return;
    } else {
      /*envie mensaje*/
      let mailMessage = {
        templateName: 'contactanos',
        params: {
          'cliente': this.firstName,
          'celular': this.cellular,
          'telefono': this.phone,
          'correo': this.mail,
          'asunto': this.subject,
          'mensaje': this.message
        },
        from: this.mail,
        to: [this.toMail],
        subject: this.subject
      }
      this._sendEmailService.enviar(mailMessage).subscribe(
        response => {
          this.messageExit = 'Gracias por contactarnos, tu mensaje se envió exitosamente te responderemos en el menor tiempo posible.';
          this.limpiar();
          return;
        },
        error => {
          console.log(error);
          this.messageError = 'Se produjo un error interno enviando el mensaje. Por favor inténtelo más tarde.';
        }
      );
    }
  }

  limpiar() {
    console.log(this.reCaptcha);
    this.firstName = '';
    this.mail = '';
    this.cellular = '';
    this.phone = '';
    this.subject = '';
    this.message = '';
    grecaptcha.reset();
  }
}
