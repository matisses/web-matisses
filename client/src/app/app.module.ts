import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RedirectComponent } from './components/redirect/redirect.component';
import { AdminComponent } from './components/admin/admin.component';

//Componentes del header
import { HeaderComponent } from './components/header/header.component';
import { TopBannerComponent } from './components/header/top-banner/top-banner.component';
import { PromocionComponent } from './components/header/top-banner/promocion/promocion.component';
import { MenuComponent } from './components/header/menu/menu.component';
import { CarritoComponent } from './components/header/menu/carrito/carrito.component';
import { CarritoSimpleComponent } from './components/header/menu/carrito/carrito-simple.component';

//Componente miga de pan
import { MigaDePanComponent } from './components/miga-de-pan/miga-de-pan.component';

//Componentes del cuerpo del home
import { HomeComponent } from './components/home/home.component';
import { RecommendedComponent } from './components/recommended/recommended.component';
import { NewProductsComponent } from './components/new-products/new-products.component';
import { BestSellerComponent } from './components/best-seller/best-seller.component';
import { TendenciasComponent } from './components/tendencias/tendencias.component';

//Componentes de Carousel principal
import { HomePrincipalComponent } from './components/principal/principal.component';
import { Slide1Component } from './components/principal/slide1/slide-1.component';
import { Slide2Component } from './components/principal/slide2/slide-2.component';
import { Slide3Component } from './components/principal/slide3/slide-3.component';
import { Slide4Component } from './components/principal/slide4/slide-4.component';

//Componentes de la seccion de categorias
import { CategoryComponent } from './components/category/category.component';
import { FiltrosComponent } from './components/category/filtros/filtros.component';
import { ProductosComponent } from './components/category/productos/productos.component';

//Componente de producto
import { ProductoComponent } from './components/producto/producto.component';
import { ProductoRelacionadosComponent } from './components/producto/productos-relacionados/producto-relacionados.component';

//Proceso de pago
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { ResumenCarritoComponent } from './components/resumen-carrito/resumen-carrito.component';
import { InfoPagoComponent } from './components/info-pago/info-pago.component';
import { ResultadoTransacciComponent } from './components/resultado-transaccion/resultado-transaccion.component';

//Componentes de las pagians estáticas
import { QuienesComponent } from './components/quienes-somos/quienes-somos.component';
import { TiendasComponent } from './components/tiendas/tiendas.component';
import { TrabajaComponent } from './components/trabaja/trabaja.component';
import { GarantiasComponent } from './components/garantias/garantias.component';
import { EnviosComponent } from './components/envios/envios.component';
import { InfoEnviosComponent } from './components/info-envios/info-envios.component';
import { ContactanosComponent } from './components/contactanos/contactanos.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { PoliticaDatosComponent } from './components/politica-datos/politica-datos.component';
import { PoliticaPrivacidadComponent } from './components/politica-privacidad/politica-privacidad.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { SinInteresComponent } from './components/sin-interes/sin-interes.component';
import { RecomendadosComponent } from './components/sin-interes/recomendados/recomendados.component';
import { HotSaleComponent } from './components/hot-sale/hot-sale.component';

//Componenete pagina de error
import { ErrorComponent } from './components/error/error.component';

//Componentes del footer
import { FooterComponent } from './components/footer/footer.component';
import { NewsletterComponent } from './components/footer/newsletter/newsletter.component';
import { ChatComponent } from './components/chat/chat.component';
import { GoUpComponent } from './components/go-up/go-up.component';

// Componenetes de mi cuenta
import { WishListComponent } from './components/wish-list/wish-list.component';

// Componenete modal prueba
import { ModalComponent } from './components/modal/modal.component';

// Promocion alf
import { PromocionAlfComponent } from './components/promocion-alf/promocion-alf.component';

//Directivas
import { StickyMenuDirective } from './directives/sticky.directive';
import { StickyBodyDirective } from './directives/sticky-body.directive';
import { StickyBgMenuDirective } from './directives/sticky-bg-menu.directive';
import { StickySubMenuDirective } from './directives/sticky-submenu.directive';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { Ng2GoogleRecaptchaModule } from 'ng2-google-recaptcha';
import { MetaModule } from '@ngx-meta/core';

@NgModule({
  declarations: [
    RedirectComponent,
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RecommendedComponent,
    NewProductsComponent,
    BestSellerComponent,
    HomePrincipalComponent,
    Slide1Component,
    Slide2Component,
    Slide3Component,
    Slide4Component,
    TopBannerComponent,
    PromocionComponent,
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
    CarritoComponent,
    TiendasComponent,
    ErrorComponent,
    FiltrosComponent,
    ProductosComponent,
    TrabajaComponent,
    GarantiasComponent,
    EnviosComponent,
    InfoEnviosComponent,
    ResumenCarritoComponent,
    ProductoComponent,
    CarritoSimpleComponent,
    IngresarComponent,
    InfoPagoComponent,
    MigaDePanComponent,
    ResultadoTransacciComponent,
    ModalComponent,
    AdminComponent,
    WishListComponent,
    ContactanosComponent,
    ProductoRelacionadosComponent,
    ChatComponent,
    GoUpComponent,
    TerminosComponent,
    PoliticaDatosComponent,
    PoliticaPrivacidadComponent,
    PreguntasFrecuentesComponent,
    SinInteresComponent,
    RecomendadosComponent,
    HotSaleComponent,
    PromocionAlfComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MetaModule.forRoot(),
    BrowserAnimationsModule,
    Ng2GoogleRecaptchaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
