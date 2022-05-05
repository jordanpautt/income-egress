import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
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

    this.loanding();
    const { name, email, password } = this.registerForm.value;
    this.authService
      .createUser(name, email, password)
      .then((credentials) => {
        console.log(credentials);
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
