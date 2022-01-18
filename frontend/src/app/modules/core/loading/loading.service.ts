import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingStatus = new BehaviorSubject<boolean>(false);

  loadingStatus$ = this.loadingStatus.asObservable();

  isLoading(value: boolean) {
    this.loadingStatus.next(value);
  }
}
