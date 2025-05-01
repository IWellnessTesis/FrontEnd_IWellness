import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../../../servicios/services/servicio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  servicios: any[] = [];
  errorMessage: string = '';
  idProveedor!: number;


  constructor(
    private servicioService: ServicioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID del proveedor desde los parámetros de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('idProveedor');
      if (id) {
        this.idProveedor = +id;
        this.cargarServicios();
      } else {
        this.errorMessage = 'Proveedor no especificado.';
      }
    });
  }

  cargarServicios(): void {
    this.servicioService.obtenerServiciosPorProveedor(this.idProveedor).subscribe({
      next: (data: any) => {
        this.servicios = data;
        console.log(this.servicios);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los servicios.';
        console.error(error);
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.servicioService.eliminar(id).subscribe({
        next: () => {
          this.servicios = this.servicios.filter(s => s._idServicio !== id);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el servicio.';
          console.error(error);
        }
      });
    }
  }
}
