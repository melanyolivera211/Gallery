import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Auth as AuthService } from '@auth/auth';
import { User } from '@user/entity/user.entity';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user: User | undefined;
  private sub?: Subscription;

  public constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public async ngOnInit(): Promise<void> {
    this.user = this.authService.getUser();
    this.sub = this.authService.loggedUser$.subscribe(u => (this.user = u));
  }

  public navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  public async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.user = undefined;
      this.router.navigate(['/login']);
    } catch {}
  }

  public ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
