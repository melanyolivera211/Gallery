import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { firebaseConfig, supabaseConfig } from './config/env.config';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Auth } from './services/firebase/auth/auth';
import { User } from './services/firebase/user/user';
import { Gallery } from './services/firebase/gallery/gallery';
import { Gallery as StorageGallery } from './services/supabase/buckets/gallery/gallery';
import { Token } from './services/storage/token/token';
import { Loading } from './services/loading/loading';
import { Auth as AuthGuard } from './guards/auth/auth';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActionSheetController } from '@ionic/angular';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    {
      provide: SupabaseClient,
      useFactory: () => createClient(supabaseConfig.url, supabaseConfig.key),
    },
    Auth,
    User,
    Gallery,
    StorageGallery,
    Loading,
    Token,
    AuthGuard,
    ActionSheetController,
  ],
})
export class CoreModule {}
