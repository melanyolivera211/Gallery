import { Injectable } from '@angular/core';

export type WallpaperTarget = 'home' | 'lock';

declare global {
  interface Window { MyWallpaperPlugin?: any }
}

@Injectable({ providedIn: 'root' })
export class WallpaperService {
  private plugin(): any {
    if (window && window.MyWallpaperPlugin) return window.MyWallpaperPlugin;
    // Capacitor plugin will be injected at runtime on native
    return null;
  }

  async setWallpaper(url: string, target: WallpaperTarget): Promise<void> {
    const p = this.plugin();
    if (!p) throw new Error('MyWallpaperPlugin not available on this platform');
    if (target === 'home') return p.setHomeScreenWallpaper({ url });
    return p.setLockScreenWallpaper({ url });
  }
}
