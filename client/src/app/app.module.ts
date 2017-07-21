import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Componentes del header
import { HeaderComponent } from './components/header/header.component';
import { TopBannerComponent } from './components/header/top-banner/top-banner.component';
import { MenuComponent } from './components/header/menu/menu.component';
import { CarritoComponent } from './components/header/menu/carrito/carrito.component';

//Componentes del cuerpo del home
import { HomeComponent } from './components/home/home.component';
import { RecommendedComponent } from './components/recommended/recommended.component';
import { NewProductsComponent } from './components/new-products/new-products.component';
import { BestSellerComponent } from './components/best-seller/best-seller.component';
import { HomePrincipalComponent } from './components/principal/principal.component';
import { TendenciasComponent } from './components/tendencias/tendencias.component';

//Componentes de la seccion de categorias
import { CategoryComponent } from './components/category/category.component';

//Componentes de las pagians estáticas
import { QuienesComponent } from './components/quienes-somos/quienes-somos.component';

//Componentes del footer
import { FooterComponent } from './components/footer/footer.component';
import { NewsletterComponent } from './components/footer/newsletter/newsletter.component';

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
    BestSellerComponent,
    HomePrincipalComponent,
    TopBannerComponent,
    MenuComponent,
    StickyMenuDirective,
    StickyBodyDirective,
    StickyBgMenuDirective,
    StickySubMenuDirective,
    TendenciasComponent,
    FooterComponent,
    NewsletterComponent,
    CategoryComponent,
    QuienesComponent,
    CarritoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
