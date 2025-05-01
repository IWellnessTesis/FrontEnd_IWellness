import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../admin/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proveedores',
  imports: [CommonModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent {

  proveedores: any[] = [];
  errorMessage: string = '';

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  // Método para cargar todos los turistas
  cargarProveedores(): void {
    this.adminService.obtenerProveedores().subscribe(
      (data: any[]) => {
         this.proveedores = data;
        console.log(data);
      },        
      (error: any) => {
        this.errorMessage = 'Error al obtener los proveedores';
        console.error('Error al obtener los proveedores', error);
      }
    );
  }

  deleteProveedor(id: number) {
    // Aquí llamas a tu servicio para eliminar el visitante
    this.adminService.eliminarUsuario(id).subscribe({
      next: () => {
        // Aquí podrías recargar la lista si estás usando ngFor
        this.cargarProveedores();
      },
      error: (err: any) => {
        console.error('Error al eliminar proveedor:', err);
      }
    });
  }
}
