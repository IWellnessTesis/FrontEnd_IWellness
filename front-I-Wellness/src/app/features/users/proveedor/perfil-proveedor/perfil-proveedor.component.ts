import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../admin/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-proveedor',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil-proveedor.component.html',
  styleUrl: './perfil-proveedor.component.css'
})
export class PerfilProveedorComponent {
  proveedor: any = {
    id: null,
    nombre: '',
    telefono: '',
    telefonoEmpresa: '',
    nombre_empresa: '',
    cargoContacto: '',
    coordenadaX: '',
    coordenadaY: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {
      const id = Number(params.get('id'));
      this.adminService.obtenerUsuarioPorId(id).subscribe({
        next: (data: any) => {
          this.proveedor = data;
          console.log('Proveedor original:', this.proveedor);
        },
      });
    });
  }

  navigateTo(path: string) {}

  guardarCambios(): void {
    const datosActualizar = {
      nombre: this.proveedor.nombre,
      telefono: this.proveedor.proveedorInfo.telefono,
      telefonoEmpresa: this.proveedor.proveedorInfo.telefonoEmpresa,
      nombre_empresa: this.proveedor.proveedorInfo.nombre_empresa,
      cargoContacto: this.proveedor.proveedorInfo.cargoContacto,
      coordenadaX: this.proveedor.proveedorInfo.coordenadaX,
      coordenadaY: this.proveedor.proveedorInfo.coordenadaY
    };

    this.adminService.actualizarProveedor(this.proveedor.id, datosActualizar)
      .subscribe(
        (response: any) => {
          alert('Proveedor actualizado correctamente');
        },
        (error: any) => {
          console.error('Error al actualizar el proveedor', error);
        }
      );
  }
}
