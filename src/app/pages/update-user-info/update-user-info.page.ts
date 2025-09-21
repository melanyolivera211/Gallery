import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

import { Loading as LoadingService } from '@core/services/loading/loading';
import { Toast as ToastService } from '@shared/services/toast/toast';
import { Auth as AuthService } from '@auth/auth';
import { User as UserService } from '@user/user';
import { Gallery as StorageGalleryService } from '@storage-gallery/gallery';
import { Gallery as GalleryService } from '@gallery/gallery';
import { BucketFile } from '@models/bucket-file.model';

import { User } from '@user/entity/user.entity';
import { Credential } from '@models/credential.model';

@Component({

	selector: 'app-update-user-info',
	templateUrl: './update-user-info.page.html',
	styleUrls: ['./update-user-info.page.scss'],
	standalone: false
}) export class UpdateUserInfoPage implements OnInit, OnDestroy {
	public user: User | null = null;
		public email: string | null = null;
    private subAuth?: Subscription;
    private subUser?: Subscription;

		public constructor(
		private authService: AuthService,
		private userService: UserService,
			private storageGallery: StorageGalleryService,
			private galleryService: GalleryService,
			private loading: LoadingService,
			private toast: ToastService,
			private router: Router,
			private alertController: AlertController
	) {}

	public ngOnInit(): void {
		// Seed with current cached values if available
		const u = this.authService.getUser();
		this.user = u ? { ...u } : null;
		this.email = this.authService.getAuthEmail();

		// React to future updates: Firebase auth email and Firestore user
		this.subAuth = this.authService.authState$.subscribe(a => {
			if (a?.email) this.email = a.email;
		});
		this.subUser = this.authService.loggedUser$.subscribe(ud => {
			this.user = ud ? { ...ud } : null;
		});
	}

	public ngOnDestroy(): void {
		this.subAuth?.unsubscribe();
		this.subUser?.unsubscribe();
	}

	public async onUserSubmit(payload: {
		user: User;
		cred: Credential;
		image: File | null;
	}): Promise<void> {
		if (!this.user?.id) return;
		try {
			this.loading.show();
				let updatedPicture: string | undefined = undefined;
				let bucket: BucketFile | null = null;

				// Si el usuario seleccionó una nueva imagen, súbela y usa esa URL
				if (payload.image) {
					bucket = await this.storageGallery.upload(payload.image, payload.image.name);
					updatedPicture = bucket.url;
				}

				// Merge incoming form values into current user
				const updated: Partial<User> = {
					name: payload.user.name,
					surname: payload.user.surname,
					picture: updatedPicture ?? payload.user.picture,
					updatedat: Timestamp.now(),
				};

			await this.userService.update(this.user.id, updated);

			// Intentar actualizar Auth (email/password); si requiere reautenticación, pedirla y reintentar
			let reauthNeeded = false;

					// Si el email cambió, actualízalo en Firebase Auth
					if (payload.cred.email && payload.cred.email !== this.email) {
						try {
							await this.authService.updateEmail(payload.cred.email);
							this.email = payload.cred.email;
						} catch (e: any) {
							if (e?.code === 'auth/requires-recent-login') {
								reauthNeeded = true;
							} else {
								throw e;
							}
						}
					}
					// Si llegó password (no vacío), cambia password
					if (payload.cred.password) {
						try {
							await this.authService.updatePassword(payload.cred.password);
						} catch (e: any) {
							if (e?.code === 'auth/requires-recent-login') {
								reauthNeeded = true;
							} else {
								throw e;
							}
						}
					}

				// Si hubo imagen nueva, guarda entrada en la galería del usuario
				if (bucket) {
					this.galleryService.setSuperKey(this.user.id);
					await this.galleryService.insert({
						createdat: Timestamp.now(),
						updatedat: Timestamp.now(),
						...bucket,
					});
				}

			// Si el password viene con valor (usuario decidió cambiarlo), lanzamos un flujo de cambio de password
			// Nota: En este código base no hay método dedicado; se puede delegar a Firebase Auth directamente si se requiere.
			// Por simplicidad, sólo persistimos datos del perfil.

			// Actualiza el usuario en memoria
			const merged: User = { ...(this.user as User), ...(updated as User) };
			this.authService.setUser(merged);

			await this.toast.showSuccessKey('app.profile.save');
			if (reauthNeeded) {
				const ok = await this.promptReauth();
				if (ok) {
					// Retry the updates after successful reauth
					if (payload.cred.email && payload.cred.email !== this.email) {
						await this.authService.updateEmail(payload.cred.email);
						this.email = payload.cred.email;
					}
					if (payload.cred.password) {
						await this.authService.updatePassword(payload.cred.password);
					}
				} else {
					await this.toast.showErrorKey('app.errors.reauth');
				}
			}
			this.router.navigate(['/home']);
		} catch (e) {
			await this.toast.showErrorKey('app.errors.unexpected');
		} finally {
			this.loading.hide();
		}
	}

	private async promptReauth(): Promise<boolean> {
		const alert = await this.alertController.create({
			header: 'Reautenticar',
			message: 'Por seguridad, ingresa tu contraseña actual.',
			inputs: [
				{ name: 'password', type: 'password', placeholder: '•••••••' }
			],
			buttons: [
				{ text: 'Cancelar', role: 'cancel' },
				{ text: 'OK', role: 'confirm' }
			]
		});
		await alert.present();
		const res = await alert.onDidDismiss();
		if (res.role === 'confirm') {
			const pwd = res.data?.values?.password as string | undefined;
			if (!pwd) return false;
			try {
				await this.authService.reauthenticate(pwd);
				return true;
			} catch {
				return false;
			}
		}
		return false;
	}

	public goHome(): void {
		this.router.navigate(['/home']);
	}
}