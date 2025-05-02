import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../admin/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

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
    coordenadaY: '',
    foto: ''
  };

  rol: string | null = null;

  fotoPreview: string | ArrayBuffer | null = null;
  fotoSeleccionada: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      
      this.rol = localStorage.getItem('rol'); 

      if (this.rol === 'Admin') {
        this.adminService.obtenerUsuarioPorId(id).subscribe({
          next: (data: any) => {
            this.proveedor = data;
            console.log('Proveedor original (Admin):', this.proveedor);
          },
        });
      } else if (this.rol === 'Proveedor') {
        this.usuarioService.obtenerPorId(id).subscribe({
          next: (data: any) => {
            this.proveedor = data;
            console.log('Proveedor original (Proveedor):', this.proveedor);
          },
        });
      } else {
        console.warn('Rol no reconocido:', this.rol);
      }
    });
  }

  navigateTo(): void {
    window.history.back();
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
        this.proveedor.foto = reader.result; 
      };
  
      reader.readAsDataURL(file); 
    }
  }

  guardarCambios(): void {
    const datosActualizar = {
      nombre: this.proveedor.nombre,
      telefono: this.proveedor.proveedorInfo.telefono,
      telefonoEmpresa: this.proveedor.proveedorInfo.telefonoEmpresa,
      nombre_empresa: this.proveedor.proveedorInfo.nombre_empresa,
      cargoContacto: this.proveedor.proveedorInfo.cargoContacto,
      coordenadaX: this.proveedor.proveedorInfo.coordenadaX,
      coordenadaY: this.proveedor.proveedorInfo.coordenadaY,
      foto: this.proveedor.foto
    };

    if (this.rol === 'Admin') {
      this.adminService.actualizarProveedor(this.proveedor.id, datosActualizar)
        .subscribe(
          () => this.mostrarAlertaExito(),
          (error) => this.mostrarAlertaError(error)
        );
    } else if (this.rol === 'Proveedor') {
      this.usuarioService.editarProveedor(this.proveedor.id, datosActualizar)
        .subscribe(
          () => this.mostrarAlertaExito(),
          (error) => this.mostrarAlertaError(error)
        );
    } else {
      console.warn('Rol no reconocido al guardar:', this.rol);
    }
  }

  mostrarAlertaExito() {
    Swal.fire({
      title: '¡Proveedor actualizado!',
      text: 'La información del proveedor se ha actualizado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#4a9c9f',
    });
  }

  mostrarAlertaError(error: any) {
    console.error('Error al actualizar el proveedor', error);
    Swal.fire({
      title: 'Error',
      text: 'Hubo un problema al actualizar el proveedor.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#4a9c9f',
    });
  }
}
