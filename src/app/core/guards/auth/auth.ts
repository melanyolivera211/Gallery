import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Token as TokenService } from '@token/token';
import { Auth as AuthService } from '@auth/auth';

import { User } from '@user/entity/user.entity';

@Injectable({
  providedIn: 'root',
})
export class Auth implements CanActivate {
  public constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  public async canActivate(): Promise<boolean> {
    const user: User | undefined = this.authService.getUser();

    if (user) return true;

    return this.validate(await this.tokenService.init()); /**/

    //return this.validate(!!this.tokenService.getAccessToken());
  }

  private validate(hasInited: boolean): boolean {
    if (!hasInited) this.router.navigate(['/login']);

    return hasInited;
  }
}
