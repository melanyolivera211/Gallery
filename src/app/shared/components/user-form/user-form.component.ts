import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Toast as ToastService } from '@shared/services/toast/toast';
import { Auth as AuthService } from '@auth/auth';

import { User } from '@user/entity/user.entity';
import { Credential } from '@models/credential.model';

import { Timestamp } from '@angular/fire/firestore';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { v4 as uuidv4 } from 'uuid';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: false,
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() public user: User | null = null;
  @Input() public email: string | null = null;
  @Output() public onSubmit = new EventEmitter<{
    user: User;
    cred: Credential;
    image: File | null;
  }>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  public userForm: FormGroup;

  public selectedImageFile: File | null = null;
  public selectedImageUrl: string | null = null;
  private authSub?: Subscription;

  public constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private auth: AuthService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', []],
    });
  }

  public ngOnInit(): void {
    this.applyInputsToForm();
    // Fill email when auth state becomes available if still empty
    this.authSub = this.auth.authState$.subscribe(a => {
      const ctrl = this.userForm.get('email');
      if (a?.email && ctrl && (!ctrl.value || ctrl.value.trim() === '')) {
        ctrl.setValue(a.email, { emitEvent: false });
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] || changes['email']) {
      this.applyInputsToForm();
    }
  }

  public ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  private applyInputsToForm(): void {
    // Configure password validators based on edit/create mode
    const pwdCtrl = this.userForm.get('password');
    if (this.user) {
      pwdCtrl?.clearValidators();
      pwdCtrl?.updateValueAndValidity();
    } else {
      pwdCtrl?.setValidators([Validators.required, Validators.minLength(6)]);
      pwdCtrl?.updateValueAndValidity();
    }

    // Patch values for edit or set blanks for create
    const effectiveEmail = this.email ?? this.auth.getAuthEmail() ?? '';
    this.userForm.patchValue({
      name: this.user?.name ?? '',
      surname: this.user?.surname ?? '',
      email: effectiveEmail,
      password: this.user ? '********' : ''
    }, { emitEvent: false });


    const emailCtrl = this.userForm.get('email');
    if (this.user) {
      emailCtrl?.disable({ emitEvent: false });
    } else {
      emailCtrl?.enable({ emitEvent: false });
    }
    if (this.user?.picture && !this.selectedImageFile) {
      this.selectedImageUrl = this.user.picture;
    }
  }

  public onSubmitForm(): void {
    if (!this.userForm.valid) {
      this.markFormGroupTouched();
    }

    const formValue = this.userForm.value;

    const rawPassword = this.userForm.get('password')?.value ?? '';
    const passwordToSend = this.user && rawPassword === '********' ? '' : rawPassword;

    const userData: User = {
      name: formValue.name,
      surname: formValue.surname,
      picture: this.user
        ? this.user.picture
        : 'https://xeqbsxstgjnrvctidbrk.supabase.co/storage/v1/object/public/gallery/img/user.png', //`https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 131812794)}?v=4`,
      createdat: this.user ? this.user.createdat : Timestamp.now(),
      updatedat: Timestamp.now(),
    };

    const credData: Credential = {
      email: (this.user ? (this.email ?? this.auth.getAuthEmail() ?? '') : formValue.email),
      password: passwordToSend,
    };

    this.onSubmit.emit({
      user: userData,
      cred: credData,
      image: this.selectedImageFile,
    });
  }

  public async takePicture(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
      });

      if (image.dataUrl) {
        this.processImage(image.dataUrl);
      }
    } catch (e: any) {
      this.toastService.showErrorKey('app.errors.unexpected');
    }
  }

  public onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.processImage(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  private processImage(dataUrl: string): void {
    this.selectedImageUrl = dataUrl;

    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        this.selectedImageFile = new File([blob], `${uuidv4()}`, {
          type: 'image/jpeg',
        });
      })
      .catch((e: any) => {
        this.toastService.showErrorKey('app.errors.unexpected');
      });
  }

  public removeImage(): void {
    this.selectedImageFile = null;
    this.selectedImageUrl = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  public hasError(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }

  public isRequired(controlName: string): boolean {
    const control = this.userForm.get(controlName);

    return control ? control.hasValidator(Validators.required) : false;
  }
}
