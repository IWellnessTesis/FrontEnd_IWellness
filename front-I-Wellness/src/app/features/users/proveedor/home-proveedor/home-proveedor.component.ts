import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ServicioService } from '../../../servicios/services/servicio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-proveedor',
  imports: [CommonModule],
  templateUrl: './home-proveedor.component.html',
  styleUrl: './home-proveedor.component.css'
})
export class HomeProveedorComponent {
  
  usuario: any;
  servicios: any[] = [];

  constructor(private router: Router, private authService: AuthService, private servicioService: ServicioService) {}

  navigateTo(path: string,id?: any) {
    this.router.navigate([path, id]);
  } 

  agregar(path: string){
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    this.authService.usuarioHome().subscribe({
      next: (data) => {
        this.usuario = data;
        this.usuario = JSON.parse(data);
        this.traerServicios();
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      }
    });
  }

  traerServicios(): void {
    this.servicioService.obtenerServiciosPorProveedor(this.usuario.id).subscribe({
      next: (data) => {
        this.servicios = data;
      }
    })
  }
  
  eliminarServicio(servicio: any){
    var index = this.servicios.indexOf(servicio)
    this.servicios.splice(index, 1);
    this.servicioService.eliminar(servicio._idServicio).subscribe({
      next: () => {
        console.log("Servicio eliminado correctamente");
      },
      error: (err) => {
        console.error("Error al eliminar:", err);
      }
    });
  }

  cambiarEstado(servicio: any) {
    servicio.estado = !servicio.estado; // cambia el estado localmente
  
    this.servicioService.actualizar(servicio._idServicio, servicio).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Error al actualizar el estado del servicio:', err);
      }
    });
  }
  
}  
        
  


