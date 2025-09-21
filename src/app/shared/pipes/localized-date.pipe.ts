import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'localizedDate', pure: false })
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(
    value: Date | string | number | null | undefined,
    format: string = 'mediumDate'
  ): string {
    if (!value) return '';

    const lang = (this.translate.currentLang || this.translate.getDefaultLang() || 'en').toLowerCase();
    const locale = lang === 'es' ? 'es' : 'en-US';

    try {
      return formatDate(value, format, locale);
    } catch {
      return '';
    }
  }
}
