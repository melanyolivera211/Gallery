import { Injectable } from '@angular/core';

import { Auth as AuthService } from '@auth/auth';
import { User as UserService } from '@user/user';

import { User } from '@user/entity/user.entity';

import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class Token {
  public constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  public async init(): Promise<boolean> {
    try {
      const access_token: string | null = localStorage.getItem('access_token');

      if (access_token) {
        const token_decoded: JwtPayload & { user_id: string } =
          jwtDecode(access_token); //Me da flojera mapear la respuesta :v

        const user: User | undefined = await this.userService.findOne(
          token_decoded.user_id
        );

        this.authService.setUser(user);

        return true;
      }

      return false;
    } catch (e: any) {
      return false;
    }
  }

  public setAccessToken(access_token: string): void {
    localStorage.setItem('access_token', access_token);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
