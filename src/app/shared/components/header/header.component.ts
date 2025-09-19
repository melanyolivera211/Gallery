import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Auth as AuthService } from '@auth/auth';
import { User } from '@user/entity/user.entity';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  public user: User | undefined;

  public constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public async ngOnInit(): Promise<void> {
    this.user = this.authService.getUser();
  }

  public navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
