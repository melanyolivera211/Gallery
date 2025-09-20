import { Component, OnInit } from '@angular/core';
import { AppTranslateService } from '@core/services/translate/translate';

@Component({
  selector: 'app-toggle-translate',
  templateUrl: './toggle-translate.component.html',
  styleUrls: ['./toggle-translate.component.scss'],
  standalone: false,
})
export class ToggleTranslateComponent implements OnInit {
  public lang: 'en' | 'es' = 'en';

  public constructor(private i18n: AppTranslateService) {}

  public ngOnInit(): void {
    this.lang = (this.i18n.current() as 'en' | 'es') || 'en';
  }

  public async onToggle(): Promise<void> {
    await this.i18n.toggle();
    this.lang = this.i18n.current() as 'en' | 'es';
  }
}
