import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import * as userActions from '../auth/auth.actions';
import { map, Observable, Observer, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { User } from '../models/user.model';
import { UserI } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription$: Subscription;
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
            this.store.dispatch(userActions.setUser({ user }));
          });
      } else {
        this.userSubscription$?.unsubscribe();
        this.store.dispatch(userActions.unSetUser());
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
