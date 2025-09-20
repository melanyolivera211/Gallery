import { Injectable } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Injectable({ providedIn: 'root' })
export class FilePickerService {
  async pickImage(): Promise<File | null> {
    const result = await FilePicker.pickImages({ multiple: false });
    if (!result.files || result.files.length === 0) return null;
    const f = result.files[0];
    if (f.blob) {
      return new File([f.blob], f.name || 'image.jpg', { type: f.mimeType || 'image/jpeg' });
    }
    return null;
  }
}
