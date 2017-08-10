import { Directive, OnInit, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector:'[sticky-bg-menu]'
})

export class StickyBgMenuDirective {

  @HostBinding("class.stuck-bg") estiloStickyBgMenu = '';

  @HostListener('window:scroll', ['$event'])
  scrollEvent(event: Event) {
    if(window.scrollY >= 56) {
      this.estiloStickyBgMenu = 'stuck-bg';
    }else{
      this.estiloStickyBgMenu = '';
    }
  }

  ngOnInit() {
      //console.log('inicializando directiva sticky bg menú');
  }

}
