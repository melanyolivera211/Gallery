import { Injectable } from '@angular/core';

import { SupabaseClient } from '@supabase/supabase-js';
import { FileObject, StorageError } from '@supabase/storage-js';

import { BucketFile } from '@models/bucket-file.model';

@Injectable({
  providedIn: 'root',
})
export class Gallery {
  public readonly bucket: string = 'gallery';
  public readonly folder: string = 'img';

  public constructor(private supabase: SupabaseClient) {}

  public async upload(file: File, path: string): Promise<BucketFile> {
    try {
      const fullPath = `${this.folder}/${path}`;

      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(fullPath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.bucket).getPublicUrl(fullPath);

      return {
        ...data,
        url: publicUrl,
      };
    } catch (e: any) {
      throw new StorageError(e.message);
    }
  }

  public async list(): Promise<Array<FileObject & { url: string }>> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .list(this.folder);

      if (error) throw error;

      const filesWithUrl: Array<FileObject & { url: string }> = data.map(
        (file) => {
          const fullPath = `${this.folder}/${file.name}`;
          const {
            data: { publicUrl },
          } = this.supabase.storage.from(this.bucket).getPublicUrl(fullPath);

          return {
            ...file,
            url: publicUrl,
          };
        }
      );

      return filesWithUrl;
    } catch (e: any) {
      throw new StorageError(e.message);
    }
  }
}
