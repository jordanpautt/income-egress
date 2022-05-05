import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as uiActions from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loandingState: boolean = false;
  uiSubscription$: Subscription;
  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.uiSubscription$ = this.store.select('ui').subscribe((ui) => {
      this.loandingState = ui.isLoanding;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription$.unsubscribe();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  loginUser(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoanding());

    // this.loanding();

    const { email, password } = this.loginForm.value;

    this.authService
      .loginUser(email, password)
      .then((credentials) => {
        this.store.dispatch(uiActions.stopLoanding());
        this.router.navigate(['/']);
        // Swal.close();
      })
      .catch((error) => {
        this.store.dispatch(uiActions.stopLoanding());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${error.message}`,
        });
      });
  }

  loanding(): void {
    Swal.fire({
      title: 'Espere porfavor.',
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
}
