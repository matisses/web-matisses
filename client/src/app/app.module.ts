import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

//Componentes del header
import { HeaderComponent } from './components/header.component';
import { TopBannerComponent } from './components/top-banner.component';
import { MenuComponent } from './components/menu.component';

//Componentes del cuerpo del home
import { HomeComponent } from './components/home/home.component';
import { RecommendedComponent } from './components/home/recommended.component';
import { NewProductsComponent } from './components/home/new-products.component';
import { DiscountsComponent } from './components/home/discounts.component';
import { HomePrincipalComponent } from './components/home/principal.component';

//Directivas
import { StickyMenuDirective } from './directives/sticky.directive';
import { StickyBodyDirective } from './directives/sticky-body.directive';
import { StickyBgMenuDirective } from './directives/sticky-bg-menu.directive';
import { StickySubMenuDirective } from './directives/sticky-submenu.directive';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RecommendedComponent,
    NewProductsComponent,
    DiscountsComponent,
    HomePrincipalComponent,
    TopBannerComponent,
    MenuComponent,
    StickyMenuDirective,
    StickyBodyDirective,
    StickyBgMenuDirective,
    StickySubMenuDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
