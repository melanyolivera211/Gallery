import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Loading {
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isLoading$: Observable<boolean> = this._isLoading.asObservable();

  public constructor() {}

  public show(): void {
    this._isLoading.next(true);
  }

  public hide(): void {
    this._isLoading.next(false);
  }
}
