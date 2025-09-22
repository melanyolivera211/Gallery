import { LOCALE_ID, NgModule } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
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

// Register Spanish locale data once
registerLocaleData(localeEs);

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
      useFactory: () => {
        const GLOBAL_KEY = '__supabase_client_singleton__';
        const g = globalThis as any;
        if (g[GLOBAL_KEY]) {
          return g[GLOBAL_KEY] as SupabaseClient;
        }
        // Simple in-memory storage (sync API) to avoid Web LockManager/localStorage
        const mem = new Map<string, string>();
        const memoryStorage = {
          getItem: (key: string) => mem.get(key) ?? null,
          setItem: (key: string, value: string) => { mem.set(key, value); },
          removeItem: (key: string) => { mem.delete(key); },
        } as unknown as Storage;

        const client = createClient(supabaseConfig.url, supabaseConfig.key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
            storageKey: 'sb-no-auth',
            storage: memoryStorage as any,
          },
        });
        g[GLOBAL_KEY] = client;
        return client;
      },
    },
    Auth,
    User,
    Gallery,
    StorageGallery,
    Loading,
    Token,
    AuthGuard,
    ActionSheetController,
    {
      provide: LOCALE_ID,
      deps: [HttpClient],
      useFactory: () => {
        return 'en-US';
      },
    },
  ],
})
export class CoreModule {}
