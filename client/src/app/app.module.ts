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
import { HomePrincipalComponent } from './components/principal/principal.component';
import { TendenciasComponent } from './components/tendencias/tendencias.component';

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
import { ContactanosComponent } from './components/contactanos/contactanos.component';

//Componenete pagina de error
import { ErrorComponent } from './components/error/error.component';

//Componentes del footer
import { FooterComponent } from './components/footer/footer.component';
import { NewsletterComponent } from './components/footer/newsletter/newsletter.component';
import { ChatComponent } from './components/chat/chat.component';

// Componenetes de mi cuenta
import { WishListComponent } from './components/wish-list/wish-list.component';

// Componenete modal prueba
import { ModalComponent } from './components/modal/modal.component';

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
    CarritoComponent,
    TiendasComponent,
    ErrorComponent,
    FiltrosComponent,
    ProductosComponent,
    TrabajaComponent,
    GarantiasComponent,
    EnviosComponent,
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
    ChatComponent
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
