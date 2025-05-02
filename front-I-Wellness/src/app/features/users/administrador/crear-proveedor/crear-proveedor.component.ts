import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../admin/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-proveedor',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-proveedor.component.html',
  styleUrl: './crear-proveedor.component.css'
})
export class CrearProveedorComponent {
   // Campos del formulario
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
 
  agregarProveedor() {
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
