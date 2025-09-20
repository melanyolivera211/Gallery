import { Injectable } from '@angular/core';
import { Toast as ToastCapacitor } from '@capacitor/toast';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type ToastPosition = 'top' | 'center' | 'bottom';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  public constructor(private translate: TranslateService) {}

  public async showError(
    message: string,
    duration: number = 4000,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    await this.showToast(message, 'error', duration, position);
  }

  public async showErrorKey(
    key: string,
    params?: Record<string, any>,
    duration: number = 4000,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    const msg = await this.t(key, params);
    await this.showToast(msg, 'error', duration, position);
  }

  public async showInfo(
    message: string,
    duration: number = 3000,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    await this.showToast(message, 'info', duration, position);
  }

  public async showInfoKey(
    key: string,
    params?: Record<string, any>,
    duration: number = 3000,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    const msg = await this.t(key, params);
    await this.showToast(msg, 'info', duration, position);
  }

  public async showWarning(
    message: string,
    duration: number = 3500,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    await this.showToast(message, 'warning', duration, position);
  }

  public async showWarningKey(
    key: string,
    params?: Record<string, any>,
    duration: number = 3500,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    const msg = await this.t(key, params);
    await this.showToast(msg, 'warning', duration, position);
  }

  async showSuccess(
    message: string,
    duration: number = 3000,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    await this.showToast(message, 'success', duration, position);
  }

  async showSuccessKey(
    key: string,
    params?: Record<string, any>,
    duration: number = 3000,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    const msg = await this.t(key, params);
    await this.showToast(msg, 'success', duration, position);
  }

  private async showToast(
    message: string,
    type: 'error' | 'info' | 'warning' | 'success',
    duration: number,
    position: ToastPosition
  ): Promise<void> {
    try {
      const durationMode = duration <= 2000 ? 'short' : 'long';

      await ToastCapacitor.show({
        text: message,
        duration: durationMode,
        position: position,
      });
    } catch (e) {
      console.log(e);

      if (typeof window !== 'undefined' && window.alert) {
        window.alert(`${type.toUpperCase()}: ${message}`);
      }
    }
  }

  private async t(key: string, params?: Record<string, any>): Promise<string> {
    try {
      return await firstValueFrom(this.translate.get(key, params));
    } catch {
      return key;
    }
  }
}
