import {Injectable} from '@angular/core';
import {JwtResponse} from '../api/models/jwt-response';
import {LOCAL_STORAGE_USER_KEY} from '../globals';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {
  }

  logOut(): void {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  }

  public saveLoggedUser(user: JwtResponse): void {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  }

  public getLoggedUser(): JwtResponse {
    const user = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
}
