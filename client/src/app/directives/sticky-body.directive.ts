import { Directive, OnInit, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector:'[sticky-body]'
})

export class StickyBodyDirective {

  @HostBinding("class.stuck-body") estiloStickyBody = '';

  @HostListener('window:scroll', ['$event'])
  scrollEvent(event: Event) {
    if(window.scrollY >= 56) {
      this.estiloStickyBody = 'stuck-body';
    }else{
      this.estiloStickyBody = '';
    }
  }

  ngOnInit() {
  }

}
