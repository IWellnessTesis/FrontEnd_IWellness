import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import countriesData from '../../../../../assets/countries+cities.json';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-turista',
  standalone: true, // Como es standalone, hay que importar FormsModule aquí
  imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './perfil-turista.component.html',
  styleUrl: './perfil-turista.component.css',
})
export class PerfilTuristaComponent implements OnInit {
  countriesData: any[] = countriesData; // Cargamos los datos directamente
  countries: string[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';

  usuario: any = {
    id: null, // Asegúrate de que se asigne el id correcto en la carga inicial
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
      this.usuarioServicio.obtenerPorId(id).subscribe({
        next: (data) => {
          this.usuario = data;
          console.log('original:', this.usuario);

          this.selectedCountry = this.usuario.turistaInfo?.pais;
          this.onCountryChange();
          this.selectedCity = this.usuario.turistaInfo?.ciudad;
        },
      });
    });
  }

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
    window.history.back();
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
            confirmButtonColor: '#3085d6'
          });
        },
        error => {
          console.error('Error al actualizar el usuario', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar tu perfil. Intenta de nuevo.',
            confirmButtonColor: '#d33'
          });
        }
      );
  }
  
  
}
