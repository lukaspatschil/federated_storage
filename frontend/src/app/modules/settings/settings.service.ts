import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type Settings = {
  maxNumberOfPoints?: string;
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private pointsCount: BehaviorSubject<number>;

  maxNumberOfPoints$: Observable<number>;

  constructor() {
    this.pointsCount = new BehaviorSubject(
      parseInt(this.loadFromLocalStorage('maxNumberOfPoints') ?? '100')
    );
    this.maxNumberOfPoints$ = this.pointsCount.asObservable();
  }

  get maxNumberOfPoints(): number {
    return this.pointsCount.getValue();
  }

  set maxNumberOfPoints(value: number) {
    this.saveToLocalStorage('maxNumberOfPoints', value.toString());
    this.pointsCount.next(value);
  }

  private loadFromLocalStorage(key: keyof Settings): string | undefined {
    const data = localStorage.getItem('settings') ?? '{}';
    const storage = JSON.parse(data) as Settings;

    return storage[key] ?? undefined;
  }

  private saveToLocalStorage(key: keyof Settings, value: string) {
    const data = localStorage.getItem('settings') ?? '{}';
    const storage = JSON.parse(data) as Settings;

    storage[key] = value;

    localStorage.setItem('settings', JSON.stringify(storage));
  }
}
