import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { IncomeEgress } from '../models/income-egress.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncomeEgressService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  createIncomeEgress(incomeEgress: IncomeEgress) {
    const { uid } = this.authService.user;

    delete incomeEgress.uid;

    return this.firestore
      .doc(`${uid}/ingreso-egresos`)
      .collection('items')
      .add({ ...incomeEgress });
  }

  initIncomeEgressListener(uid: string) {
    return this.firestore
      .collection(`${uid}/ingreso-egresos/items`)
      .snapshotChanges()
      .pipe(
        map((snapShot) => {
          return snapShot.map((doc) => ({
            uid: doc.payload.doc.id,
            ...(doc.payload.doc.data() as any),
          }));
        })
      );
  }

  deleteIncomeEgress(uidItem: string) {
    const { uid } = this.authService.user;
    return this.firestore
      .doc(`${uid}/ingreso-egresos/items/${uidItem}`)
      .delete();
  }
}
