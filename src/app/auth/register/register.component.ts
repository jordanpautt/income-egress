import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as uiActions from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
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
    this.uiSubscription$?.unsubscribe();
  }

  buildForm(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  resgisterUser(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoanding());

    // this.loanding();
    const { name, email, password } = this.registerForm.value;
    this.authService
      .createUser(name, email, password)
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
