import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { QuienesComponent } from './components/quienes-somos/quienes-somos.component';
import { TiendasComponent } from './components/tiendas/tiendas.component';
import { ErrorComponent } from './components/error/error.component';
import { TrabajaComponent } from './components/trabaja/trabaja.component';
import { GarantiasComponent } from './components/garantias/garantias.component';
import { EnviosComponent } from './components/envios/envios.component';
import { ResumenCarritoComponent } from './components/resumen-carrito/resumen-carrito.component';
import { ProductoComponent } from './components/producto/producto.component';


const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'categoria', component: CategoryComponent, pathMatch: 'full'},
    {path: 'quienes', component: QuienesComponent},
    {path: 'tiendas', component: TiendasComponent},
    {path: 'trabaja-con-nosotros', component: TrabajaComponent},
    {path: 'garantias', component: GarantiasComponent},
    {path: 'envios', component: EnviosComponent},
    {path: 'resumen-carrito', component: ResumenCarritoComponent},
    {path: 'producto', component: ProductoComponent},
    //,{path: 'producto/:productId', component: CategoryComponent},
    {path: '**', component: ErrorComponent} //pagina 404
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
