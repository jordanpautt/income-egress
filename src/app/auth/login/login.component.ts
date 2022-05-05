import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
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

    this.loanding();

    const { email, password } = this.loginForm.value;

    this.authService
      .loginUser(email, password)
      .then((credentials) => {
        this.router.navigate(['/']);
        Swal.close();
      })
      .catch((error) => {
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
