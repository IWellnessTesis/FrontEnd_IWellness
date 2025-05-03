import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import countriesData from '../../../../../assets/countries+cities.json';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-turista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil-turista.component.html',
  styleUrl: './perfil-turista.component.css',
})
export class PerfilTuristaComponent implements OnInit {
  countriesData: any[] = countriesData;
  countries: string[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';
  isLoading: boolean = true;
  error: string = '';
  unauthorized: boolean = false;

  usuario: any = {
    id: null,
    nombre: '',
    foto: '',
    turistaInfo: {
      telefono: null,
      ciudad: '',
      pais: ''
    }
  };

  fotoPreview: string | ArrayBuffer | null = null;
  fotoSeleccionada: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioServicio: UsuarioService
  ) {}

  ngOnInit() {
    this.countries = this.countriesData.map((country) => country.name);

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.cargarPerfil(id);
    });
  }

  cargarPerfil(id: number) {
    // Asegurarse de que isLoading está en true al comenzar
    this.isLoading = true;
    this.unauthorized = false;
    
    this.usuarioServicio.obtenerPorId(id).subscribe({
      next: (data) => {
        this.usuario = data;
        this.selectedCountry = this.usuario.turistaInfo?.pais;
        this.onCountryChange();
        this.selectedCity = this.usuario.turistaInfo?.ciudad;
        // Importante: poner isLoading en false cuando los datos se cargan exitosamente
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener perfil:', error);
        
        // Importante: poner isLoading en false cuando hay un error
        this.isLoading = false;
        
        if (error.status === 403) {
          this.unauthorized = true;
          this.error = 'No tiene permiso para acceder a este perfil';
          
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tiene permisos para ver este perfil',
            confirmButtonColor: '#E82A3C'
          }).then(() => {
            this.router.navigate(['/hometurista']);
          });
        } else if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.error = 'Error al cargar el perfil';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el perfil',
            confirmButtonColor: '#E82A3C'
          });
        }
      }
    });
  }

  // Resto de métodos existentes...
  
  seleccionarFoto(): void {
    const input = document.getElementById('fotoInput') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }
  
  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        this.fotoPreview = reader.result;
        this.usuario.foto = reader.result; 
      };
  
      reader.readAsDataURL(file); 
    }
  }

  onCountryChange() {
    const country = this.countriesData.find(
      (c) => c.name === this.selectedCountry
    );
    this.cities = country ? country.cities : [];
  }

  navigateTo() {
    this.router.navigate(['/hometurista']);
  }

  guardarCambios(): void {
    const datosActualizar = {
      nombre: this.usuario.nombre,
      telefono: this.usuario.turistaInfo.telefono,
      ciudad: this.selectedCity,
      pais: this.selectedCountry,
      foto: this.usuario.foto
    };
  
    this.usuarioServicio.editarTurista(this.usuario.id, datosActualizar)
      .subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: '¡Cambios guardados!',
            text: 'Tu perfil ha sido actualizado correctamente.',
            confirmButtonColor: '#4a9c9f'
          });
        },
        error => {
          console.error('Error al actualizar el usuario', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar tu perfil. Intenta de nuevo.',
            confirmButtonColor: '#E82A3C'
          });
        }
      );
  }

  cargarPerfilPorId(id: number) {
    this.usuarioServicio.obtenerPorId(id).subscribe({
      next: (data) => {
        this.usuario = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener perfil:', error);
        
        if (error.status === 403) {
          // Usuario no tiene permiso
          this.unauthorized = true;
          this.error = 'No tiene permiso para acceder a este perfil';
        } else if (error.status === 401) {
          // Usuario no autenticado
          this.router.navigate(['/login']);
        } else {
          this.error = 'Error al cargar el perfil';
        }
        
        this.isLoading = false;
      }
    });
  }
  
  
}
