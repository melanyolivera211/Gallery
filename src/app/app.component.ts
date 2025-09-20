import { Component, OnInit } from '@angular/core';
import { AppTranslateService } from '@core/services/translate/translate';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public constructor(private i18n: AppTranslateService) {}

  public async ngOnInit(): Promise<void> {
    this.i18n.init();
  }
}
