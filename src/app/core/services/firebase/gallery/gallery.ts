import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Picture } from './entity/picture.entity';
import { User } from '@user/entity/user.entity';

import { FirebaseError } from '@angular/fire/app';

import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  updateDoc,
  getDoc,
  doc,
  addDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class Gallery {
  private readonly superCollectionName: string = 'user';
  private readonly collectionName: string = 'gallery';

  private superKey!: User['id'];

  public constructor(private firestore: Firestore) {}

  public setSuperKey(superKey: User['id']): void {
    this.superKey = superKey;
  }

  public findOne(id: Picture['id']): Promise<Picture | undefined> {
    try {
      return getDoc(
        doc(
          collection(
            this.firestore,
            `${this.superCollectionName}/${this.superKey}/${this.collectionName}`
          ),
          id
        )
      ).then((snapshot) => snapshot.data()) as Promise<Picture | undefined>;
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }

  public findAll(): Observable<Array<Picture>> {
    try {
      return collectionData(
        collection(
          this.firestore,
          `${this.superCollectionName}/${this.superKey}/${this.collectionName}`
        ),
        {
          idField: 'id',
        }
      ) as Observable<Array<Picture>>;
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }

  public async insert(entity: Picture): Promise<Picture['id']> {
    try {
      const doc = await addDoc(
        collection(
          this.firestore,
          `${this.superCollectionName}/${this.superKey}/${this.collectionName}`
        ),
        entity
      );

      return doc.id;
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }

  public async update(
    id: Picture['id'],
    entity: Partial<Picture>
  ): Promise<void> {
    try {
      await updateDoc(
        doc(
          this.firestore,
          `${this.superCollectionName}/${this.superKey}/${this.collectionName}/${id}`
        ),
        entity
      );
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }

  public async delete(id: Picture['id']): Promise<void> {
    try {
      await deleteDoc(
        doc(
          this.firestore,
          `${this.superCollectionName}/${this.superKey}/${this.collectionName}/${id}`
        )
      );
    } catch (e: any) {
      throw new FirebaseError('Error', e.message);
    }
  }
}
