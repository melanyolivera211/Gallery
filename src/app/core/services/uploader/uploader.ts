import { Injectable } from '@angular/core';
import { FilePickerService } from '../file-picker/file-picker';
import { Gallery as StorageGallery } from '@storage-gallery/gallery';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class UploaderService {
  constructor(
    private picker: FilePickerService,
    private storage: StorageGallery
  ) {}

  async pickAndUpload(): Promise<{ url: string; path: string } | null> {
    const file = await this.picker.pickImage();
    if (!file) return null;
    const path = `${uuidv4()}_${file.name}`;
    const res = await this.storage.upload(file, path);
    return { url: res.url, path: res.path }; // path is from BucketFile
  }
}
