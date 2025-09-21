import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Auth as AuthFire,
  UserCredential,
  User as AuthUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  onAuthStateChanged,
  browserSessionPersistence,
  setPersistence,
  updateEmail as afUpdateEmail,
  updatePassword as afUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';
import { User as UserService } from '@user/user';
import { User } from '@user/entity/user.entity';
import { Credential } from '@models/credential.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private _loggedUser: BehaviorSubject<User | undefined> = new BehaviorSubject<
    User | undefined
  >(undefined);
  public loggedUser$: Observable<User | undefined> =
    this._loggedUser.asObservable();

  public authState$: Observable<AuthUser | null>;

  public constructor(private auth: AuthFire, private userService: UserService) {
    this.authState$ = authState(this.auth);

    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const u: User | undefined = await this.userService.findOne(user.uid);
        this._loggedUser.next(u);
      } else {
        //localStorage.removeItem('access_token');
      }
    });
  }

  public async login(cred: Credential): Promise<string> {
    try {
      await setPersistence(this.auth, browserSessionPersistence);
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        cred.email,
        cred.password
      );

      if (userCredential.user) {
        const UToken: string = await userCredential.user.getIdToken();

        const user: User | undefined = await this.userService.findOne(
          userCredential.user.uid
        );

        this._loggedUser.next(user);

        localStorage.setItem('access_token', UToken);

        return UToken;
      } else {
        throw new FirebaseError('ERROR', 'Wrong credentials.');
      }
    } catch (e: any) {
      if (e instanceof FirebaseError) {
        throw e;
      } else {
        throw new Error(e.message);
      }
    }
  }

  public async logup(cred: Credential, user: User): Promise<string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        cred.email,
        cred.password
      );

      if (userCredential.user) {
        const UToken: string = await userCredential.user.getIdToken();

        user.id = userCredential.user.uid;

        await this.userService.insert(user);

        this._loggedUser.next(user);

        return UToken;
      } else {
        throw new FirebaseError('Error', 'Wrong paramethers.');
      }
    } catch (e: any) {
      if (e instanceof FirebaseError) {
        throw e;
      } else {
        throw new Error(e.message);
      }
    }
  }

  public async logout(): Promise<void> {
    //localStorage.removeItem('access_token');
    this._loggedUser.next(undefined);
    await signOut(this.auth);
  }

  public getUser(): User | undefined {
    return this._loggedUser.value;
  }

  public setUser(user: User | undefined) {
    return this._loggedUser.next(user);
  }

  public getAuthEmail(): string | null {
    return this.auth.currentUser?.email ?? null;
  }

  public async updateEmail(newEmail: string): Promise<void> {
    if (!this.auth.currentUser) throw new Error('No authenticated user');
    await afUpdateEmail(this.auth.currentUser, newEmail);
  }

  public async updatePassword(newPassword: string): Promise<void> {
    if (!this.auth.currentUser) throw new Error('No authenticated user');
    await afUpdatePassword(this.auth.currentUser, newPassword);
  }

  public async reauthenticate(currentPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user || !user.email) throw new Error('No authenticated user');
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);
  }

}
