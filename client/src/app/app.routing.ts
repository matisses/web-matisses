import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { QuienesComponent } from './components/quienes-somos/quienes-somos.component';

const appRoutes: Routes = [

    {path: '', component: HomeComponent},
    {path: 'categoria/:categoryId', component: CategoryComponent},
    {path: 'quienes', component: QuienesComponent},
    //,{path: 'producto/:productId', component: CategoryComponent},
    {path: '**', component: HomeComponent} //pagina 404
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
