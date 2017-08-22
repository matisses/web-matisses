import { Directive, OnInit, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector:'[sticky-submenu]'
})

export class StickySubMenuDirective {

  @HostBinding("class.stuck-submenu") estiloStickySubMenu = '';

  @HostListener('window:scroll', ['$event'])
  scrollEvent(event: Event) {
    this.evaluateScroll();
  }

  ngOnInit() {
      this.evaluateScroll();
  }

  private evaluateScroll(){
    if(window.scrollY >= 56) {
      this.estiloStickySubMenu = 'stuck-submenu';
    }else{
      this.estiloStickySubMenu = '';
    }
  }
}
