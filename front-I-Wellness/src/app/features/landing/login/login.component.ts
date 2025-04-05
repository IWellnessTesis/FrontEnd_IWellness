import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  emailError: string = '';
  showPassword: boolean = false;
  


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  validateEmail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.correo.match(regex)) {
      this.emailError = 'Ingrese un correo electrónico válido';
    } else {
      this.emailError = '';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  onSubmit() {
    if (!this.correo || !this.password) {
      this.errorMessage = 'Por favor ingrese correo y contraseña';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.correo, this.password)
    .subscribe({
      next: (response:  any ) =>  {
          this.isLoading = false;
          
          // Redireccionar según el rol
          const user = response.usuario || {};
          const rolNombre = user.rol?.nombre || '';
          
          if (rolNombre === 'Turista') {
            this.router.navigate(['/hometurista']);
          } else if (rolNombre === 'Proveedor') {
            this.router.navigate(['/homeproveedor']);
          } else if (rolNombre === 'Administrador') {
            this.router.navigate(['/homeadmin']);
          } else {
            this.errorMessage = 'Rol de usuario no reconocido';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error en el inicio de sesión';
        }
      });
  }
}