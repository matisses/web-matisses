import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { QuienesComponent } from './components/quienes-somos/quienes-somos.component';
import { TiendasComponent } from './components/tiendas/tiendas.component';
import { ErrorComponent } from './components/error/error.component';
import { TrabajaComponent } from './components/trabaja/trabaja.component';
import { GarantiasComponent } from './components/garantias/garantias.component';
import { EnviosComponent } from './components/envios/envios.component';
import { InfoEnviosComponent } from './components/info-envios/info-envios.component';
import { ResumenCarritoComponent } from './components/resumen-carrito/resumen-carrito.component';
import { ProductoComponent } from './components/producto/producto.component';
import { RedirectComponent } from './components/redirect/redirect.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { InfoPagoComponent } from './components/info-pago/info-pago.component';
import { ResultadoTransacciComponent } from './components/resultado-transaccion/resultado-transaccion.component';
import { ModalComponent } from './components/modal/modal.component';
import { AdminComponent } from './components/admin/admin.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { ContactanosComponent } from './components/contactanos/contactanos.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { PoliticaDatosComponent } from './components/politica-datos/politica-datos.component';
import { PoliticaPrivacidadComponent } from './components/politica-privacidad/politica-privacidad.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { SinInteresComponent } from './components/sin-interes/sin-interes.component';
import { HotSaleComponent } from './components/hot-sale/hot-sale.component';
// Lista de Regalos
import { ListaRegalosComponent } from './components/lista-de-regalos/lista-regalos.component';
import { CrearListaComponent } from './components/lista-de-regalos/crear-lista/crear-lista.component';
import { MiListaComponent } from './components/lista-de-regalos/mi-lista/mi-lista.component';


const appRoutes: Routes = [
  //{path: '', component: HomeComponent},
  {
    path: '',
    canActivateChild: [MetaGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          meta: {
            title: 'Matisses',
            description: 'Compra online todos nuestros artículos y disfruta de lo mejor en mobiliario y accesorios para tu hogar.'
          }
        }
      },
      {
        path: 'producto/:item',
        component: ProductoComponent,
        data: {
          meta: {
            title: 'Matisses',
            description: ''
          }
        }
      },
      //Lista de regalos
      {
        path: 'lista-de-regalos',
        component: ListaRegalosComponent,
        pathMatch: 'full',
        data: {
          meta: {
            title: 'Matisses - Lista de Regalos',
            description: 'Lista de regalos Matisses te permite elegir entre todos los productos que tenemos en nuestro amplio catálogo, compartirla con tus invitados y ellos podrán elegir de tu lista lo que quieren regalarte.'
          }
        }
      },
      { path: 'lista-de-regalos/crear-lista', component: CrearListaComponent },
      { path: 'mi-lista', component: MiListaComponent }
    ]
  },

  // { path: '92-consola', redirectTo: 'categoria?group=002' },
  // { path: 'categoria', component: CategoryComponent, pathMatch: 'full' },
  { path: 'quienes', component: QuienesComponent },
  { path: 'tiendas', component: TiendasComponent },
  { path: 'sin-intereses', component: SinInteresComponent },
  { path: 'trabaja-con-nosotros', component: TrabajaComponent },
  // { path: 'hot-sale', component: HotSaleComponent },
  { path: 'garantias', component: GarantiasComponent },
  { path: 'envios', component: EnviosComponent },
  { path: 'info-envios', component: InfoEnviosComponent },
  { path: 'resumen-carrito', component: ResumenCarritoComponent },
  //{ path: 'producto/:item', component: ProductoComponent },
  { path: 'redirect/:previous', component: RedirectComponent },
  { path: 'ingresar', component: IngresarComponent },
  { path: 'info-pago', component: InfoPagoComponent },
  { path: 'resultado-transaccion/:idCarrito', component: ResultadoTransacciComponent },
  { path: 'pruebas', component: ModalComponent },
  { path: 'admin/:token', component: AdminComponent },
  { path: 'lista-de-deseos', component: WishListComponent },
  { path: 'contactanos', component: ContactanosComponent },
  { path: 'terminos-y-condiciones', component: TerminosComponent },
  { path: 'politica-manejo-de-datos', component: PoliticaDatosComponent },
  { path: 'politica-de-privacidad', component: PoliticaPrivacidadComponent },
  { path: 'preguntas-frecuentes', component: PreguntasFrecuentesComponent },
  { path: '**', component: ErrorComponent } //pagina 404
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
