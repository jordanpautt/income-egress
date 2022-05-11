import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  nameUser: string = '';
  userSubcription$: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

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

  logout(): void {
    this.loanding();
    this.auth.logout().then(() => {
      setTimeout(() => {
        Swal.close();
        this.router.navigate(['login']);
      }, 1000);
    });
  }

  loanding(): void {
    Swal.fire({
      title: 'Cerrando sesión.',
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
}
