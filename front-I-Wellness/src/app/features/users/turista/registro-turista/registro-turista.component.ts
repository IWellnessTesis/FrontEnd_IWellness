import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import countriesData from '../../../../../assets/countries+cities.json';
import { AuthService } from '../../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-turista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-turista.component.html',
  styleUrl: './registro-turista.component.css'
})
export class RegistroTuristaComponent implements OnInit {
  // Variables de datos
  countriesData: any[] = countriesData as any[];
  countries: string[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';

  // Campos del formulario
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';

  // Mensajes de error
  nameError: string = '';
  emailError: string = '';
  phoneError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  
  // Estado de carga
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.countries = this.countriesData.map(country => country.name);
  }

  onCountryChange() {
    const country = this.countriesData.find(c => c.name === this.selectedCountry);
    this.cities = country ? country.cities : [];
    this.selectedCity = this.cities.length > 0 ? this.cities[0] : '';
  }

  validateName() {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!this.name.match(regex)) {
      this.nameError = 'El nombre solo puede contener letras y espacios';
    } else {
      this.nameError = '';
    }
  }

  validateEmail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email.match(regex)) {
      this.emailError = 'Ingrese un correo electrónico válido';
    } else {
      this.emailError = '';
    }
  }

  validatePhone() {
    const regex = /^[0-9]{7,15}$/;
    if (!this.phone.match(regex)) {
      this.phoneError = 'El teléfono solo puede contener números (7 a 15 dígitos)';
    } else {
      this.phoneError = '';
    }
  }

  validatePassword() {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?/~]).{8,20}$/;
    if (!RegExp(regex).exec(this.password)) {
      this.passwordError = 'Debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial';
    } else {
      this.passwordError = '';
    }
  }

  validateConfirmPassword() {
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Las contraseñas no coinciden';
    } else {
      this.confirmPasswordError = '';
    }
  }

  registerUser() {
    this.validateName();
    this.validateEmail();
    this.validatePhone();
    this.validatePassword();
    this.validateConfirmPassword();

    if (!this.nameError && !this.emailError && !this.phoneError && !this.passwordError && !this.confirmPasswordError) {
      this.isLoading = true;
      
      // Obtener la ciudad seleccionada o la primera de la lista
      const selectedCity = this.selectedCity || (this.cities.length > 0 ? this.cities[0] : '');
      
      const userData = {
        nombre: this.name,
        correo: this.email,
        contraseña: this.password,
        telefono: this.phone,
        ciudad: selectedCity,
        pais: this.selectedCountry,
      };

      // Registrar al usuario - el servicio actualizará guarda credenciales en localStorage
      this.authService.registerTurista(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registro exitoso:', response);
          
          // Alerta de éxito
          Swal.fire({
            title: '¡Registro Exitoso!',
            text: 'Tu cuenta ha sido registrada correctamente.',
            icon: 'success',
            confirmButtonColor: '#4a9c9f',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Después del registro, intentamos login automático
            this.authService.login(userData.correo, userData.contraseña).subscribe({
              next: () => {
                // Redirigir al formulario de gustos tras login exitoso
                this.router.navigate(['formulariogustos']);
              },
              error: (loginError) => {
                console.error('Error en login automático:', loginError);
                // Aun sin login, redirigimos al formulario de gustos para mantener el flujo
                this.router.navigate(['formulariogustos']);
              }
            });
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en el registro:', error);
          
          // Alerta de error con el mensaje correspondiente
          if (error.message && error.message.includes('correo ya está registrado')) {
            this.emailError = 'Este correo electrónico ya está registrado';
            Swal.fire({
              title: 'Error',
              text: 'Este correo electrónico ya está registrado. Por favor, usa otro.',
              icon: 'error',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Aceptar'
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema en el registro. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      });
    } else {
      console.log('Corrige los errores antes de enviar el formulario.');

      // Alerta de validación
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, corrige los errores antes de continuar.',
        icon: 'warning',
        confirmButtonColor: '#4a9c9f',
        confirmButtonText: 'Aceptar'
      });
    }
  }
}