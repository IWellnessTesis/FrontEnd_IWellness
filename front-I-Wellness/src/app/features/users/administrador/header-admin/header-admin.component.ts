import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  imports: [],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
  constructor(private router: Router) {}
  navigateTo(path: string) {
    if (path === '') {
      localStorage.clear(); // Borra todo el localStorage
    }
    this.router.navigate([path]);
  }
}
