import { NgModule } from '@angular/core';

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

@NgModule({

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
  ],
})
export class CoreModule {}
