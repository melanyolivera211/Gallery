import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonComponent } from './components/buttons/button/button.component';
import { FloatingButtonComponent } from './components/buttons/floating-button/floating-button.component';
import { ToggleTranslateComponent } from './components/buttons/toggle-translate/toggle-translate.component';
import { CardComponent } from './components/card/card.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { HeaderComponent } from './components/header/header.component';
import { InputComponent } from './components/input/input.component';
import { LinkComponent } from './components/link/link.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PictureComponent } from './components/picture/picture.component';
import { UserFormComponent } from './components/user-form/user-form.component';

import { Toast } from './services/toast/toast';
import { ActionSheetController } from '@ionic/angular';

@NgModule({

	declarations: [

		ButtonComponent,
		FloatingButtonComponent,
		ToggleTranslateComponent,
		CardComponent,
		GalleryComponent,
		HeaderComponent,
		InputComponent,
		LinkComponent,
		LoadingComponent,
		PictureComponent,
		UserFormComponent

	], imports: [

		CommonModule,
		FormsModule,
		IonicModule.forRoot(),
		ReactiveFormsModule,
		RouterModule,
		TranslateModule,

	], exports: [

		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		RouterModule,
		TranslateModule,
		ButtonComponent,
		FloatingButtonComponent,
		ToggleTranslateComponent,
		CardComponent,
		GalleryComponent,
		HeaderComponent,
		InputComponent,
		LinkComponent,
		PictureComponent,
		LoadingComponent,
		UserFormComponent

	], providers: [

			Toast,
			ActionSheetController

	]

}) export class SharedModule {}