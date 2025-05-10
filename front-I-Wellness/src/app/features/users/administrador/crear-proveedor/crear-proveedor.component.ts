import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../admin/services/admin.service';
import { Router } from '@angular/router';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField} from 'ngx-intl-tel-input';

@Component({
  selector: 'app-crear-proveedor',
  imports: [CommonModule, FormsModule, NgxIntlTelInputModule],
  templateUrl: './crear-proveedor.component.html',
  styleUrl: './crear-proveedor.component.css'
})
export class CrearProveedorComponent {
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.CostaRica, CountryISO.Colombia];

   // Campos del formulario
   name: string = '';
   contactPosition: string = '';
   phone: any = '';
   password: string = '';
   confirmPassword: string = '';
   companyName: string = '';
   email: string = '';
   companyNamePhone: any = '';
   coordinateX: string = '';
   coordinateY: string = '';
 
   // Errores
   nameError = '';
   contactPositionError = '';
   phoneError = '';
   passwordError = '';
   confirmPasswordError: string = '';
   companyNameError = '';
   emailError = '';
   companyNamePhoneError = '';
   coordinateXError = '';
   coordinateYError = '';
 
   isLoading = false;
 
   constructor(
     private adminService: AdminService,
     private router: Router
   ) {}
 
   validateForm(): boolean {
     this.validateName();
     this.validatecontactPosition();
     this.validatePhone();
     this.validatePassword();
     this.validatecompanyName();
     this.validateEmail();
     this.validatecompanyNamePhone();
     this.validatecoordinateX();
     this.validatecoordinateY();
     return !this.hasErrors();
   }
 
   hasErrors(): boolean {
     return !!(this.nameError || this.contactPositionError || this.phoneError || this.passwordError || this.companyNameError || this.emailError || this.companyNamePhoneError || this.coordinateXError || this.coordinateYError);
   }
 
  // Validaciones
  validateName() {
    this.nameError = this.name.trim() ? '' : 'El nombre es obligatorio';
  }

  validatecontactPosition() {
    this.contactPositionError = this.contactPosition.trim() ? '' : 'El cargo de contacto es obligatorio';
  }

  validatePhone() {
    const phoneNumber = this.phone.internationalNumber;
    const regex = /^\+?\s?[0-9\s]{7,15}$/;
    if (!phoneNumber.match(regex)) {
      this.phoneError = 'El teléfono solo puede contener números (7 a 15 dígitos)';
    } else {
      this.phoneError = '';
    }
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
    const phoneNumber = this.companyNamePhone.internationalNumber;
    const regex = /^\+?\s?[0-9\s]{7,15}$/;
    if (!phoneNumber.match(regex)) {
      this.companyNamePhoneError = 'El teléfono solo puede contener números (7 a 15 dígitos)';
    } else {
      this.companyNamePhoneError = '';
    }
  }

  validatecoordinateX() {
    const coordinateRegex = /^-?\d{1,3}\.\d+$/;
    this.coordinateXError = this.coordinateX.match(coordinateRegex) ? '' : 'Ingrese la coordenada X correctamente';
  }

  validatecoordinateY() {
    const coordinateRegex = /^-?\d{1,3}\.\d+$/;
    this.coordinateYError = this.coordinateY.match(coordinateRegex) ? '' : 'Ingrese la coordenada Y correctamente';
  }
 
  agregarProveedor() {
    if (this.validateForm()) {
      this.isLoading = true;
      const providerData = {
        nombre: this.name,
        cargoContacto: this.contactPosition,
        telefono: this.phone.internationalNumber,
        contraseña: this.password,
        nombre_empresa: this.companyName,
        correo: this.email,
        telefonoEmpresa: this.companyNamePhone.internationalNumber,
        coordenadaX: this.coordinateX || '0',
        coordenadaY: this.coordinateY || '0'
      };
  
      this.adminService.crearProveedor(providerData).subscribe({
        next: () => {
          this.isLoading = false;
          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Proveedor registrado exitosamente',
            text: 'El proveedor ha sido creado correctamente.',
            confirmButtonColor: '#4a9c9f',
            confirmButtonText: 'Aceptar',
            timer: 3000 // Cierra la alerta después de 3 segundos
          }).then(() => {
            // Redirigir a la página de proveedores después de la alerta
            this.router.navigate(['/proveedores']);
          });
        },
        error: (error) => {
          this.isLoading = false;
          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: error?.message || 'Inténtalo nuevamente.',
            confirmButtonColor: '#4a9c9f',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }
  
}
