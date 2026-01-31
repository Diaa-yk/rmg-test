import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class CacheService {
  private requests = new Map<string, HttpResponse<any>>();

  put(url: string, response: HttpResponse<any>): void {
    this.requests.set(url, response);
  }

  get(url: string): HttpResponse<any> | undefined {
    return this.requests.get(url);
  }

  invalidate(urlPart: string): void {
    this.requests.forEach((value, key) => {
      if (key.includes(urlPart)) {
        this.requests.delete(key);
      }
    });
  }

  clear(): void {
    this.requests.clear();
  }
}
