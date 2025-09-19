import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Loading as LoadingService } from '@core/services/loading/loading';
import { Toast as ToastService } from '@shared/services/toast/toast';
import { Auth as AuthService } from '@auth/auth';
import { Token as TokenService } from '@token/token';

import { Credential } from '@models/credential.model';
import { User } from '@user/entity/user.entity';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;

  public constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  public ngOnInit(): void {}

  public async onSubmit(): Promise<void> {
    try {
      this.loadingService.show();

      if (this.loginForm.valid) {
        const formValue = this.loginForm.value;

        const cred: Credential = {
          email: formValue.email,
          password: formValue.password,
        };

        const access_token: string = await this.authService.login(cred);

        this.tokenService.setAccessToken(access_token);

        this.router.navigate(['/home']);
      } else {
        this.markFormGroupTouched();
        throw new Error('Please fill all required fields correctly');
      }
    } catch (e: any) {
      await this.toastService.showError(e.message);
    } finally {
      this.loadingService.hide();
    }
  }

  public navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  public navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  public hasError(controlName: string, errorName: string): boolean {
    const control = this.loginForm.get(controlName);

    return control ? control.hasError(errorName) && control.touched : false;
  }
}
