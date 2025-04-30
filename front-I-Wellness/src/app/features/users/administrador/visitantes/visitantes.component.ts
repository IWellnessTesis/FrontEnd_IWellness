import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../admin/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visitantes',
  imports: [CommonModule],
  templateUrl: './visitantes.component.html',
  styleUrl: './visitantes.component.css'
})
export class VisitantesComponent {

  visitantes: any[] = [];
  errorMessage: string = '';

  constructor(private router: Router, private adminService: AdminService) {}

  
  ngOnInit(): void {
    this.cargarTuristas();
  }

  // Método para cargar todos los turistas
  cargarTuristas(): void {
    this.adminService.obtenerTuristas().subscribe(
      (data: any[]) => {
         this.visitantes = data;
        console.log(data);
      },        
      (error: any) => {
        this.errorMessage = 'Error al obtener los turistas';
        console.error('Error al obtener los turistas', error);
      }
    );
  }

  navigateTo(ruta: string, id?: number) {
    if (id) {
      this.router.navigate([ruta, id]);
    } else {
      this.router.navigate([ruta]);
    }
  }

  deleteVisitante(id: number) {
    // Aquí llamas a tu servicio para eliminar el visitante
    this.adminService.eliminarUsuario(id).subscribe({
      next: () => {
        // Aquí podrías recargar la lista si estás usando ngFor
        this.cargarTuristas();
      },
      error: (err: any) => {
        console.error('Error al eliminar visitante:', err);
      }
    });
  }

  agregar(path: string){
    this.router.navigate([path]);
  }
}
