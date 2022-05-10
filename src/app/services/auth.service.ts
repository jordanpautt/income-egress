import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import * as userActions from '../auth/auth.actions';
import { UserI } from '../interfaces/user.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable, Observer, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as actionIncomeEgress from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: User;
  userSubscription$: Subscription;

  get user(): User {
    return { ...this._user };
  }

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((userF) => {
      if (userF) {
        this.userSubscription$ = this.firestore
          .doc(`${userF?.uid}/user`)
          .valueChanges()
          .subscribe((partialFirestoreUser: Partial<Observer<UserI>>) => {
            const firestoreUser: UserI = partialFirestoreUser as UserI;

            const user = User.fromFireBase(firestoreUser);
            this._user = user;
            this.store.dispatch(userActions.setUser({ user }));
          });
      } else {
        this._user = null;
        this.userSubscription$?.unsubscribe();
        this.store.dispatch(userActions.unSetUser());
        this.store.dispatch(actionIncomeEgress.unSettItems());
      }
    });
  }

  loginUser(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((userFb) => userFb !== null));
  }

  createUser(name: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new User(user?.uid, name, email);

        return this.firestore.doc(`${user?.uid}/user`).set({ ...newUser });
      });
  }
}
