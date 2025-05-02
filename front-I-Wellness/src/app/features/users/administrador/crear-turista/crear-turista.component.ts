import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import countriesData from '../../../../../assets/countries+cities.json';
import { AdminService } from '../../../admin/services/admin.service';
import { TuristaXPreferenciaService } from '../../../preferencias/services/turistaXpreferencias/turista-xpreferencia.service';
import { PreferenciasService } from '../../../preferencias/services/preferencias/preferencias.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-crear-turista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-turista.component.html',
  styleUrl: './crear-turista.component.css'
})
export class CrearTuristaComponent implements OnInit {
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

  preferencias: any[] = [];
  selectedPreferences: number[] = [];

  constructor(
    private adminService: AdminService,
    private preferenciasService: PreferenciasService, 
    private turistaXPreferencia: TuristaXPreferenciaService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.countries = this.countriesData.map(country => country.name);
    this.cargarPreferencias();
    
  }

  cargarPreferencias() {
    this.preferenciasService.obtenerPreferencias().subscribe({
      next: (data) => {
        this.preferencias = data;
        console.log('Preferencias cargadas:', this.preferencias);
      },
      error: (error) => {
        console.error('Error al obtener preferencias:', error);
        // En caso de error, cargar preferencias predeterminadas
      }
    });
  }

  onPreferenceChange(event: any, idPreferencia: number) {
    if (event.target.checked) {
      if (this.selectedPreferences.length < 5) {
        this.selectedPreferences.push(idPreferencia);
      } else {
        // Desmarca si ya hay 5 seleccionadas
        event.target.checked = false;
      }
    } else {
      this.selectedPreferences = this.selectedPreferences.filter(id => id !== idPreferencia);
    }
  }

  validatePreferences() {
    if (this.selectedPreferences.length < 3 || this.selectedPreferences.length > 5) {
      alert('Debes seleccionar entre 3 y 5 preferencias');
    }
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

  createTurista() {
    this.validateName();
    this.validateEmail();
    this.validatePhone();
    this.validatePassword();
    this.validateConfirmPassword();
    this.validatePreferences();
  
    if (!this.nameError && !this.emailError && !this.phoneError && !this.passwordError && !this.confirmPasswordError) {
      this.isLoading = true;
  
      const selectedCity = this.selectedCity || (this.cities.length > 0 ? this.cities[0] : '');
  
      const turistaData = {
        nombre: this.name,
        correo: this.email,
        contraseña: this.password,
        telefono: this.phone,
        ciudad: selectedCity,
        pais: this.selectedCountry,
      };
  
      this.adminService.crearTurista(turistaData).subscribe({
        next: (response: any) => {
          const turistaId = response.id;
          const totalPreferencias = this.selectedPreferences.length;
          let asociadas = 0;
  
          if (totalPreferencias === 0) {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Turista creado',
              text: 'El turista fue creado exitosamente.',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              this.router.navigate(['listado-turistas']);
            });
            return;
          }
  
          this.selectedPreferences.forEach((prefId: number) => {
            const turistaXPreferencia = {
              idUsuario: turistaId,
              preferencia: {
                _idPreferencias: prefId
              }
            };
  
            this.turistaXPreferencia.crear(turistaXPreferencia).subscribe({
              next: () => {
                asociadas++;
                if (asociadas === totalPreferencias) {
                  this.isLoading = false;
                  Swal.fire({
                    icon: 'success',
                    title: 'Turista creado',
                    text: 'El turista y sus preferencias fueron registrados correctamente.',
                    confirmButtonColor: '#3085d6'
                  }).then(() => {
                    this.router.navigate(['visitantes']);
                  });
                }
              },
              error: (error: any) => {
                console.error(`Error al asociar preferencia ${prefId}:`, error);
                asociadas++;
                if (asociadas === totalPreferencias) {
                  this.isLoading = false;
                  Swal.fire({
                    icon: 'warning',
                    title: 'Turista creado con advertencias',
                    text: 'El turista fue creado, pero algunas preferencias no se asociaron correctamente.',
                    confirmButtonColor: '#f39c12'
                  }).then(() => {
                    this.router.navigate(['listado-turistas']);
                  });
                }
              }
            });
          });
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error al crear turista:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error en la creación del turista. Por favor, intente nuevamente.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Corrige los errores antes de enviar el formulario.',
        confirmButtonColor: '#d33'
      });
    }
  }
}
