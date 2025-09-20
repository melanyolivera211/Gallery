import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

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
}) export class UpdateUserInfoPage implements OnInit {
	public user: User | null = null;

		public constructor(
		private authService: AuthService,
		private userService: UserService,
			private storageGallery: StorageGalleryService,
			private galleryService: GalleryService,
		private loading: LoadingService,
		private toast: ToastService,
		private router: Router
	) {}

	public ngOnInit(): void {
		const u = this.authService.getUser();
		this.user = u ? { ...u } : null;
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
			this.router.navigate(['/home']);
		} catch (e) {
			await this.toast.showErrorKey('app.errors.unexpected');
		} finally {
			this.loading.hide();
		}
	}
}