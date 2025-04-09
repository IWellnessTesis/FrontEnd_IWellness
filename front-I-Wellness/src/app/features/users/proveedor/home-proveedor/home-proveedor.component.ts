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

  ngOnInit(): void {
    this.authService.usuarioHome().subscribe({
      next: (data) => {
        this.usuario = data;
        this.usuario = JSON.parse(data);
        console.log('Usuario cargado:', this.usuario);
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
        console.log(this.servicios);
      }
    })
  }
  
}  
        
  


