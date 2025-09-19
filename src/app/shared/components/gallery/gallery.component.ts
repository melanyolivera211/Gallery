import {
  Component,
  OnInit,
} from '@angular/core';

import { Picture } from '@gallery/entity/picture.entity';

import { Auth as AuthService } from '@auth/auth';
import { Gallery as GalleryService } from '@gallery/gallery';
import { Gallery as StorageGalleryService } from '@storage-gallery/gallery';
import { Loading as LoadingService } from '@core/services/loading/loading';
import { Toast as ToastService } from '@shared/services/toast/toast';

import { User } from '@user/entity/user.entity';
import { BucketFile } from '@models/bucket-file.model';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { v4 as uuidv4 } from 'uuid';

import { Timestamp } from '@angular/fire/firestore';

interface PictureGroup {
  date: Date;
  pictures: Picture[];
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: false,
})
export class GalleryComponent implements OnInit {
  public pictures: Array<Picture> = [];
  public groupedPictures: Array<PictureGroup> = [];

  public selectedImageFile: File | null = null;

  public constructor(
    private authService: AuthService,
    private galleryService: GalleryService,
    private storageGalleryService: StorageGalleryService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadingService.show();

    this.findAll();
  }

  private findAll(): void {
    const user: User | undefined = this.authService.getUser();

    if (user) {
      this.galleryService.setSuperKey(user.id);

      this.galleryService.findAll().subscribe({
        next: (t) => {
          this.pictures = t;
          this.groupPictures();
        },
        error: (e: any) => this.toastService.showError(e.message),
      });
    }
  }

  public async takePicture(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
      });

      const user: User | undefined = this.authService.getUser();

      if (image.dataUrl && user) {
        this.loadingService.show();

        const dataUrl = image.dataUrl;

        const res = await fetch(dataUrl);

        const blob = await res.blob();

        const file = new File([blob], `${uuidv4()}`, { type: 'image/jpeg' });

        const bucket: BucketFile = await this.storageGalleryService.upload(
          file,
          file.name
        );

        this.galleryService.setSuperKey(user.id);

        await this.galleryService.insert({
          createdat: Timestamp.now(),
          updatedat: Timestamp.now(),
          ...bucket,
        });
      }
    } catch (e: any) {
      this.toastService.showError(e.message);
    } finally {
      this.loadingService.hide();
    }
  }

  private groupPictures(): void {
    const groups: { [key: string]: Picture[] } = {};

    this.pictures.forEach((picture) => {
      if (picture.createdat) {
        const date = new Date(picture.createdat.toDate());
        date.setHours(0, 0, 0, 0);

        const dateKey = date.toISOString();

        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }

        groups[dateKey].push(picture);
      }
    });

    // Convertir a array y ordenar por fecha (más reciente primero)
    this.groupedPictures = Object.keys(groups)
      .map((key) => ({
        date: new Date(key),
        pictures: groups[key],
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    this.loadingService.hide();
  }
}
