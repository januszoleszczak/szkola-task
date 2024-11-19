import { Injectable } from '@angular/core';
import { accountMock } from '../account.mock';
import { User } from '../user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private readonly user: User = accountMock;

  login(username: string, password: string): boolean {
    if (username === this.user.username && password === this.user.password) {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
