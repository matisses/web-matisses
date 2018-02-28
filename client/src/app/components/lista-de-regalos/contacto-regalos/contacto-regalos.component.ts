import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../../services/global'
import { SendEmailService } from '../../../services/send-email.service';

//declare var jquery: any;
declare var $: any;
declare var grecaptcha: any;

@Component({
  templateUrl: 'contacto-regalos.html',
  styleUrls: ['contacto-regalos.component.css'],
  providers: [SendEmailService]
})

export class ContactoRegalosComponent implements OnInit {
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
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

  public onCaptchaComplete(response: any) {
    this.reCaptcha = response.token;
  }

  public enviar(contactForm) {
    this.valid = true;
    this.messageError = '';
    this.messageExit = '';
    if (this.firstName == null || this.firstName.length <= 0 ||
      this.mail == null || this.mail.length <= 0 ||
      this.subject == null || this.subject.length <= 0 ||
      this.message == null || this.message.length <= 0 /*||
      !this.reCaptcha*/) {
      this.messageError = 'Debes llenar todos los campos obligatorios para poder proceder con el envío.';
      this.valid = false;
      return;
    } else {
      /*envie mensaje*/
      let celular = 'No suministrado';
      let telefono = 'No suministrado';
      if (this.cellular != null && this.cellular.length > 0) {
        celular = this.cellular;
      }
      if (this.phone != null && this.phone.length > 0) {
        telefono = this.phone;
      }

      let mailMessage = {
        templateName: 'lista_regalos_contactanos',
        params: {
          'cliente': this.firstName,
          'celular': celular,
          'telefono': telefono,
          'correo': this.mail,
          'asunto': this.subject,
          'mensaje': this.message
        },
        from: 'Contacto Lista de Regalo Matisses <listaideal@matisses.co>',
        to: [this.toMail, this.mail],
        subject: this.subject
      }
      this._sendEmailService.enviar(mailMessage).subscribe(
        response => {
          this.messageExit = 'Gracias por contactarnos, tu mensaje se envió exitosamente. Te responderemos en el menor tiempo posible.';
          contactForm.reset();
          this.limpiar();
          return;
        },
        error => {
          console.error(error);
          this.messageError = 'Se produjo un error interno enviando el mensaje. Por favor inténtalo más tarde.';
        }
      );
    }
  }

  public limpiar() {
    this.firstName = '';
    this.mail = '';
    this.cellular = '';
    this.phone = '';
    this.subject = '';
    this.message = '';
    //grecaptcha.reset();
    //this._router.navigate(['/lista-de-regalos/contactenos']);
  }
}
