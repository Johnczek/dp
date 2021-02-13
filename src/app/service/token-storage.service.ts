import {Injectable} from '@angular/core';
import {JwtResponse} from '../api/models/jwt-response';
import {SESSION_STORAGE_USER_KEY} from '../globals';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {
  }

  logOut(): void {
    sessionStorage.clear();
  }

  public saveLoggedUser(user: JwtResponse): void {
    sessionStorage.removeItem(SESSION_STORAGE_USER_KEY);
    sessionStorage.setItem(SESSION_STORAGE_USER_KEY, JSON.stringify(user));
  }

  public getLoggedUser(): JwtResponse {
    const user = sessionStorage.getItem(SESSION_STORAGE_USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
}
