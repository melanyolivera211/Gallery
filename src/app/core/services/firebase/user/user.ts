import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User as UserEntity } from '@user/entity/user.entity';

import { FirebaseError } from '@angular/fire/app';

import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc,
  doc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly collectionName: string = 'user';

  public constructor(private firestore: Firestore) {}

  public findOne(id: UserEntity['id']): Promise<UserEntity | undefined> {
    try {
      return getDoc(
        doc(collection(this.firestore, this.collectionName), id)
      ).then((snapshot) => snapshot.data()) as Promise<UserEntity | undefined>;
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }

  public findAll(): Observable<Array<UserEntity>> {
    try {
      return collectionData(collection(this.firestore, this.collectionName), {
        idField: 'id',
      }) as Observable<Array<UserEntity>>;
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }

  public async insert(entity: UserEntity): Promise<void> {
    try {
      await setDoc(
        doc(this.firestore, `${this.collectionName}/${entity.id as string}`),
        entity
      );
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }

  public async update(
    id: UserEntity['id'],
    entity: Partial<UserEntity>
  ): Promise<void> {
    try {
      await updateDoc(
        doc(this.firestore, `${this.collectionName}/${id}`),
        entity
      );
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }

  public async delete(id: UserEntity['id']): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, `${this.collectionName}/${id}`));
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }
}
