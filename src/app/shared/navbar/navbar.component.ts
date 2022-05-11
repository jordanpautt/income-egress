import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent implements OnInit, OnDestroy {
  nameUser: string = '';
  userSubcription$: Subscription;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.userSubcription$ = this.store
      .select('user')
      .pipe(filter(({ user }) => user !== null))
      .subscribe(({ user }) => {
        this.nameUser = user.name;
      });
  }
  
  ngOnDestroy(): void {
    this.userSubcription$?.unsubscribe();
  }
}
