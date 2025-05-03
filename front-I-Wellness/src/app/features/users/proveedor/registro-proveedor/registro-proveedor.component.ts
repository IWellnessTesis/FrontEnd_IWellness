import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-proveedor.component.html',
  styleUrl: './registro-proveedor.component.css'
})
export class RegistroProveedorComponent {
  // Form fields
  name: string = '';
  contactPosition: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  companyName: string = '';
  email: string = '';
  companyNamePhone: string = '';
  coordinateX: string = '';
  coordinateY: string = '';

  // Error variables
  nameError: string = '';
  contactPositionError: string = '';
  phoneError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  companyNameError: string = '';
  emailError: string = '';
  companyNamePhoneError: string = '';
  coordinateXError: string = '';
  coordinateYError: string = '';

  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Validación del formulario antes de registrar
  validateForm(): boolean {
    this.validateName();
    this.validatecontactPosition();
    this.validatePhone();
    this.validatePassword();
    this.validateConfirmPassword();
    this.validatecompanyName();
    this.validateEmail();
    this.validatecompanyNamePhone();
    this.validatecoordinateX();
    this.validatecoordinateY();

    return !this.hasErrors();
  }

  // Validaciones
  validateName() {
    this.nameError = this.name.trim() ? '' : 'El nombre es obligatorio';
  }

  validatecontactPosition() {
    this.contactPositionError = this.contactPosition.trim() ? '' : 'El cargo de contacto es obligatorio';
  }

  validatePhone() {
    const phoneRegex = /^[0-9]{7,15}$/;
    this.phoneError = this.phone.match(phoneRegex) ? '' : 'El teléfono debe tener entre 7 y 15 dígitos numéricos';
  }

  validatePassword() {
    this.passwordError = this.password.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres';
  }

  validateConfirmPassword() {
    this.confirmPasswordError = this.password === this.confirmPassword ? '' : 'Las contraseñas no coinciden';
  }

  validatecompanyName() {
    this.companyNameError = this.companyName.trim() ? '' : 'Ingrese el nombre de la empresa';
  }

  validateEmail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailError = this.email.match(regex) ? '' : 'Ingrese un correo electrónico válido';
  }

  validatecompanyNamePhone() {
    const phoneRegex = /^[0-9]{7,15}$/;
    this.companyNamePhoneError = this.companyNamePhone.match(phoneRegex) ? '' : 'El teléfono de la empresa debe tener entre 7 y 15 dígitos numéricos';
  }

  validatecoordinateX() {
    const coordinateRegex = /^-?\d{1,3}\.\d+$/;
    this.coordinateXError = this.coordinateX.match(coordinateRegex) ? '' : 'Ingrese la coordenada X correctamente';
  }

  validatecoordinateY() {
    const coordinateRegex = /^-?\d{1,3}\.\d+$/;
    this.coordinateYError = this.coordinateY.match(coordinateRegex) ? '' : 'Ingrese la coordenada Y correctamente';
  }

  // Verifica si hay errores para deshabilitar el botón
  hasErrors(): boolean {
    return !!(this.nameError || this.contactPositionError || this.phoneError || this.passwordError || this.confirmPasswordError || this.companyNameError || this.emailError || this.companyNamePhoneError || this.coordinateXError || this.coordinateYError);
  }

  register() {
    if (this.validateForm()) {
      this.isLoading = true;
  
      const providerData = {
        nombre: this.name,
        cargoContacto: this.contactPosition,
        telefono: this.phone,
        contraseña: this.password,
        nombre_empresa: this.companyName,
        correo: this.email,
        telefonoEmpresa: this.companyNamePhone,
        coordenadaX: this.coordinateX || '0',
        coordenadaY: this.coordinateY || '0'
      };
  
      this.authService.registerProveedor(providerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registro y login exitosos:', response);
          
          // El token ya está guardado por el servicio de auth
          // Redirigir directamente al home del proveedor
          this.router.navigate(['/homeproveedor']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en el registro:', error);
          if (error.error && error.error.includes('correo ya está registrado')) {
            this.emailError = 'Este correo electrónico ya está registrado';
          } else {
            alert('Error en el registro. Por favor, intente nuevamente.');
          }
        }
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
