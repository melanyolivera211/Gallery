import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppPreferencesService } from '../preferences/preferences';

@Injectable({ providedIn: 'root' })
export class AppTranslateService {
  private supported = ['en', 'es'] as const;
  private prefKey = 'lang';

  public constructor(
    private translate: TranslateService,
    private prefs: AppPreferencesService
  ) {}

  public async init(): Promise<void> {
    this.translate.addLangs(this.supported as unknown as string[]);
    this.translate.setDefaultLang('en');
    const saved = await this.prefs.get(this.prefKey);
    if (saved === 'en' || saved === 'es') {
      this.translate.use(saved);
      return;
    }
    const browser = navigator?.language?.slice(0, 2).toLowerCase();
    const lang = this.supported.includes(browser as any)
      ? (browser as 'en' | 'es')
      : 'en';
    this.translate.use(lang);
    await this.prefs.set(this.prefKey, lang);
  }

  public async toggle(): Promise<void> {
    const current = this.translate.currentLang || 'en';
    const next = current === 'en' ? 'es' : 'en';
    await this.setLanguage(next);
  }

  public async setLanguage(lang: 'en' | 'es'): Promise<void> {
    this.translate.use(lang);
    await this.prefs.set(this.prefKey, lang);
  }

  public current(): string {
    return this.translate.currentLang || this.translate.getDefaultLang() || 'en';
  }
}
