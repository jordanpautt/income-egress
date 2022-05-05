import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent {
  constructor(private auth: AuthService, private router: Router) {}

  // ngOnInit(): void {}

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
