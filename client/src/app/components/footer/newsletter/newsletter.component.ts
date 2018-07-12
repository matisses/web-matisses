import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MailChimpService } from '../../../services/mailchimp-service';

declare var $: any;

@Component({
  selector: 'newsletter',
  templateUrl: 'newsletter.html',
  styleUrls: ['newsletter.component.css'],
  providers: [MailChimpService]
})

export class NewsletterComponent implements OnInit {
  public name: string = '';
  public lastname: string = '';
  public email: string = '';
  public errorMessage: string;
  public successMessage: string;
  public valid: boolean = true;
  public urlNewsletter: any;

  constructor(private _route: ActivatedRoute, private _router: Router, private _mailchimpService: MailChimpService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.urlNewsletter = window.location.href;
    console.log(this.urlNewsletter);


    if (this.urlNewsletter === 'https://www.matisses.co/') {
      setTimeout(function () {
        $('#modalSuscripcion').modal('show');
      }, 5000);
    } else { }
  }

  public abrirModal() {
    if (!this.email || this.email.length <= 0) {
      this.valid = false;
      return;
    }

    this.valid = true;
    $('#modalSuscripcion').modal('show');
  }

  public suscribir(subscribeForm) {
    this.valid = true;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.email.length > 0 && this.name.length > 0 && this.lastname.length > 0) {
      let MailChimpSubscribeDTO = {
        email_address: this.email,
        status: 'pending',
        merge_fields: {
          FNAME: this.name,
          LNAME: this.lastname
        }
      }

      this._mailchimpService.suscribir(MailChimpSubscribeDTO).subscribe(
        response => {
          if (response.estado == 0) {
            this.successMessage = response.mensaje;
            subscribeForm.reset();
          } else {
            this.errorMessage = response.mensaje;
          }
        },
        error => {
          this.errorMessage = error;
        }
      );
    } else {
      this.errorMessage = 'Debe llenar todos los campos para poder realizar la suscripción.';
      this.valid = false;
      return;
    }
  }

  public limpiar() {
    this.name = '';
    this.lastname = '';
    this.email = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.valid = true;
  }
}
