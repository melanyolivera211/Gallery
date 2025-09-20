import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateUserInfoPageRoutingModule } from './update-user-info-routing.module';

import { UpdateUserInfoPage } from './update-user-info.page';
import { SharedModule } from '@shared/shared-module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TranslateModule,
    UpdateUserInfoPageRoutingModule
  ],
  declarations: [UpdateUserInfoPage]
})
export class UpdateUserInfoPageModule {}
