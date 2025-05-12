import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../../../servicios/services/servicio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicios-proveedor',
  imports: [CommonModule],
  templateUrl: './servicios-proveedor.component.html',
  styleUrl: './servicios-proveedor.component.css'
})
export class ServiciosProveedorComponent {

    proveedorId: any;
    servicios: any;
    nombreEmpresa: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private servicioService: ServicioService
  ) {}

    ngOnInit(): void {
    this.nombreEmpresa = sessionStorage.getItem('nombreEmpresa');
    // Obtener el id del proveedor de la URL
    this.proveedorId = this.route.snapshot.paramMap.get('id');
    
    if (this.proveedorId) {
      this.servicioService.obtenerServiciosPorProveedor(this.proveedorId).subscribe({
        next: (data) => {
          this.servicios = data;
          console.log('servicios:', this.servicios);
        },
        error: (err) => console.error('Error al obtener los servicios', err),
      });
    }
  }

    navigateToDetalle(id: number) {
    this.router.navigate(['/infoservicio/', id]);
  }
}
