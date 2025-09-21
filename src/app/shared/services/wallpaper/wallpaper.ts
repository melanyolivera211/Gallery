import { Injectable } from '@angular/core';
import { MyWallpaperPlugin } from '../../../plugins/my-wallpaper-plugin';

export type WallpaperTarget = 'home' | 'lock';

@Injectable({ providedIn: 'root' })
export class WallpaperService {
  async setWallpaper(url: string, target: WallpaperTarget): Promise<void> {
    const prepared = await this.prepareUrl(url);
    if (target === 'home') {
      return MyWallpaperPlugin.setHomeScreenWallpaper({ url: prepared });
    }
    try {
      return await MyWallpaperPlugin.setLockScreenWallpaper({ url: prepared });
    } catch (e) {
      // Fallback: if lock fails (unsupported/OEM), try home so the user still gets a wallpaper
      try {
        await MyWallpaperPlugin.setHomeScreenWallpaper({ url: prepared });
      } catch (_) {
        throw e;
      }
    }
  }

  private async prepareUrl(url: string): Promise<string> {
    // If already data/content/file URL, pass through
    if (url.startsWith('data:') || url.startsWith('content:') || url.startsWith('file:')) {
      return url;
    }
    // For http(s), convert to data URL to avoid plugin-side networking issues
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const resp = await fetch(url);
        const blob = await resp.blob();
        const b64 = await this.blobToDataURL(blob);
        return b64;
      } catch {
        // If fetch fails, fall back to original (plugin will try to download)
        return url;
      }
    }
    return url;
  }

  private blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
