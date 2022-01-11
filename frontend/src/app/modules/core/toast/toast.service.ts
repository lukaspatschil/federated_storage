import { Injectable } from '@angular/core';

type Toast = {
  header: string;
  body: string;
  classname?: string;
  delay?: number;
};

type ToastOptions = {
  classname?: string;
  delay?: number;
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private internalToasts: Toast[];

  constructor() {
    this.internalToasts = [];
  }

  get toasts(): Toast[] {
    return this.internalToasts;
  }

  show(header: string, body: string, options: ToastOptions = {}) {
    this.internalToasts.push({ header, body, ...options });
  }

  remove(toast: Toast) {
    this.internalToasts = this.internalToasts.filter((t) => t != toast);
  }
}
