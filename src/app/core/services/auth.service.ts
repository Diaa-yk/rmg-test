import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  login(user: string, pass: string): boolean {
    if (user === 'admin' && pass === '123456') {
      localStorage.setItem('auth_token', 'fake-jwt-token');
      this.isLoggedIn$.next(true);
      this.router.navigate(['/']); 
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  get isAuthenticated() {
    return this.isLoggedIn$.asObservable();
  }
}