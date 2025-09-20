import { registerPlugin, WebPlugin } from '@capacitor/core';

export interface SetWallpaperOptions { url: string }

export interface MyWallpaperPluginAPI {
  setHomeScreenWallpaper(options: SetWallpaperOptions): Promise<void>;
  setLockScreenWallpaper(options: SetWallpaperOptions): Promise<void>;
}

class MyWallpaperWeb extends WebPlugin implements MyWallpaperPluginAPI {
  async setHomeScreenWallpaper(): Promise<void> {
    throw this.unavailable('Wallpaper not supported on web');
  }
  async setLockScreenWallpaper(): Promise<void> {
    throw this.unavailable('Wallpaper not supported on web');
  }
}

export const MyWallpaperPlugin = registerPlugin<MyWallpaperPluginAPI>(
  'MyWallpaperPlugin',
  {
    web: () => new MyWallpaperWeb(),
  }
);
