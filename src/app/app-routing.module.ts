import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { Auth as AuthGuard } from '@guards/auth/auth';

const routes: Routes = [

	{
		path: 'login',
		loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)

	}, {

		path: '',
		redirectTo: 'login',
		pathMatch: 'full'

	}, {

		path: 'home',
		loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
		canActivate: [AuthGuard]

	}, {

		path: 'register',
		loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)

	}, {

		path: 'profile',
		loadChildren: () => import('./pages/update-user-info/update-user-info.module').then( m => m.UpdateUserInfoPageModule),
		canActivate: [AuthGuard]

	},

];

@NgModule({

	imports: [

		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })

	], exports: [RouterModule]

}) export class AppRoutingModule {}