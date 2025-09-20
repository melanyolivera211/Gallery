import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Loading as LoadingService } from '@core/services/loading/loading';
import { Toast as ToastService } from '@shared/services/toast/toast';
import { Auth as AuthService } from '@auth/auth';
import { Gallery as StorageGalleryService } from '@storage-gallery/gallery';
import { Gallery as GalleryService } from '@gallery/gallery';

import { User } from '@user/entity/user.entity';
import { Credential } from '@models/credential.model';
import { BucketFile } from '@models/bucket-file.model';

import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  public constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private storageGalleryService: StorageGalleryService,
    private galleryService: GalleryService,
    private router: Router
  ) {}

  public ngOnInit() {}

  public async onUserSubmit(account: {
    user: User;
    cred: Credential;
    image: File | null;
  }): Promise<void> {
    try {
      this.loadingService.show();

      let user: User = account.user;
      const cred: Credential = account.cred;

      let bucket: BucketFile | null = null;

      if (account.image) {
        bucket = await this.storageGalleryService.upload(
          account.image,
          account.image.name
        );

        user.picture = bucket.url;
      }

      await this.authService.logup(cred, user);

      if (bucket) {
        user = this.authService.getUser() as User;

        this.galleryService.setSuperKey(user.id);

        await this.galleryService.insert({
          createdat: Timestamp.now(),
          updatedat: Timestamp.now(),
          ...bucket,
        });
      }

      this.router.navigate(['/home']);
    } catch (e: any) {
      this.toastService.showErrorKey('app.errors.registerFailed');
    } finally {
      this.loadingService.hide();
    }
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
