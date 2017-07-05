import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

//Componentes del header
import { HeaderComponent } from './components/header.component';

//Componentes del cuerpo del home
import { HomeComponent } from './components/home/home.component';
import { RecommendedComponent } from './components/home/recommended.component';
import { NewProductsComponent } from './components/home/new-products.component';
import { DiscountsComponent } from './components/home/discounts.component';
import { HomePrincipalComponent } from './components/home/principal.component';

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
    HomePrincipalComponent
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
