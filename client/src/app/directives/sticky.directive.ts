import { Directive, OnInit, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector:'[sticky-menu]'
})

export class StickyMenuDirective {

  @HostBinding("class.stuck") estiloSticky = '';

  @HostListener('window:scroll', ['$event'])
  scrollEvent(event: Event) {
    if(window.scrollY >= 56) {
      this.estiloSticky = 'stuck';
    }else{
      this.estiloSticky = '';
    }
  }

  ngOnInit() {
      console.log('inicializando directiva sticky menu');
  }

}
