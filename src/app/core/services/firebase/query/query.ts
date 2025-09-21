import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc, deleteDoc, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { WhereFilterOp } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class QueryService {
  constructor(private firestore: Firestore) {}

  public collectionRef(path: string): CollectionReference<DocumentData> {
    return collection(this.firestore, path) as CollectionReference<DocumentData>;
  }

  public async findById<T>(path: string, id: string): Promise<T | undefined> {
    const ref = doc(this.firestore, `${path}/${id}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as T) : undefined;
  }

  public async findWhere<T>(path: string, field: string, op: WhereFilterOp, value: unknown): Promise<T[]> {
    const q = query(this.collectionRef(path), where(field, op, value as any));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...(d.data() as object) }) as T);
  }

  public async upsert<T extends { id?: string }>(path: string, data: T, id?: string): Promise<string> {
    const docId = id || data.id || doc(this.collectionRef(path)).id;
    const ref = doc(this.firestore, `${path}/${docId}`);
    await setDoc(ref, { ...data, id: docId }, { merge: true });
    return docId;
  }

  public async update<T>(path: string, id: string, data: Partial<T>): Promise<void> {
    const ref = doc(this.firestore, `${path}/${id}`);
    await updateDoc(ref, data as any);
  }

  public async delete(path: string, id: string): Promise<void> {
    const ref = doc(this.firestore, `${path}/${id}`);
    await deleteDoc(ref);
  }
}
