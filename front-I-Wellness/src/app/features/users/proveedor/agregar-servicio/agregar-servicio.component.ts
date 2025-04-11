import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioService } from '../../../servicios/services/servicio.service';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-agregar-servicio',
   standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './agregar-servicio.component.html',
  styleUrl: './agregar-servicio.component.css'
})
export class AgregarServicioComponent {

  usuario: any;

  // Modelo del nuevo servicio
  nuevoServicio = {
    _idProveedor: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '', 
    horario: '',
    estado: true
  };

   // Días de la semana disponibles
   days = [
    { name: 'Lunes', selected: false },
    { name: 'Martes', selected: false },
    { name: 'Miércoles', selected: false },
    { name: 'Jueves', selected: false },
    { name: 'Viernes', selected: false },
    { name: 'Sábado', selected: false },
    { name: 'Domingo', selected: false }
  ];

  // Horario de inicio y fin
  startTime: string = '';
  endTime: string = '';

  imagePreview: string | null = null;


  constructor(private router: Router, private servicioService: ServicioService, private authService:AuthService) {}

  ngOnInit(): void {
    this.authService.usuarioHome().subscribe({
      next: (data) => {
        this.usuario = data;
        this.usuario = JSON.parse(data);
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      }
    });
  }
  
  // Método para generar la cadena de horario estandarizada
  getFormattedSchedule(): string {
    const selectedDays = this.days
      .filter(day => day.selected)
      .map(day => day.name)
      .join(', ');

    return selectedDays && this.startTime && this.endTime
      ? `${selectedDays}; ${this.startTime} - ${this.endTime}`
      : 'Horario no seleccionado';
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.nuevoServicio.imagen = this.imagePreview; // Guardamos la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  }

  guardarServicio() {
    // Generar el string de horario
    this.nuevoServicio.horario = this.getFormattedSchedule();

    this.nuevoServicio._idProveedor = this.usuario.id

    this.servicioService.guardar(this.nuevoServicio).subscribe({
      next: () => {
        this.router.navigate(['homeproveedor']);
      },
      error: err => {
        console.error('Error al crear servicio:', err);
      }
    });
  }

}
