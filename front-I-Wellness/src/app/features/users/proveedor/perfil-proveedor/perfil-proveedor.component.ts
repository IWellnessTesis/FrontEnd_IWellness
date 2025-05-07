import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../admin/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { AuthorizationService } from '../../../../core/services/auth/authorization.service';

@Component({
  selector: 'app-perfil-proveedor',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil-proveedor.component.html',
  styleUrl: './perfil-proveedor.component.css'
})
export class PerfilProveedorComponent implements OnInit {
  proveedor: any = {
    id: null,
    nombre: '',
    telefono: '',
    telefonoEmpresa: '',
    nombre_empresa: '',
    cargoContacto: '',
    coordenadaX: '',
    coordenadaY: '',
    foto: '',
    proveedorInfo: {
      telefono: '',
      telefonoEmpresa: '',
      nombre_empresa: '',
      cargoContacto: '',
      coordenadaX: '',
      coordenadaY: ''
    }
  };

  rol: string | null = null;
  isLoading: boolean = true;
  unauthorized: boolean = false;
  error: string = '';

  fotoPreview: string | ArrayBuffer | null = null;
  fotoSeleccionada: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private usuarioService: UsuarioService,
    private router: Router,
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.rol = localStorage.getItem('rol');
      this.verificarAccesoYCargarPerfil(id);
    });
  }

  verificarAccesoYCargarPerfil(id: number) {
    this.isLoading = true;
    
    // Verificar si tiene acceso
    this.authorizationService.canAccessProfile(id).subscribe({
      next: (canAccess) => {
        if (canAccess) {
          this.cargarPerfil(id);
        } else {
          this.handleUnauthorizedAccess();
        }
      },
      error: (error) => {
        console.error('Error verificando acceso:', error);
        this.handleUnauthorizedAccess();
      }
    });
  }

  cargarPerfil(id: number) {
    if (this.rol === 'Admin') {
      this.adminService.obtenerUsuarioPorId(id).subscribe({
        next: (data: any) => {
          this.proveedor = data;
          console.log('Proveedor original (Admin):', this.proveedor);
          this.isLoading = false;
          this.unauthorized = false;
        },
        error: (error) => this.handleError(error)
      });
    } else if (this.rol === 'Proveedor') {
      this.usuarioService.obtenerPorId(id).subscribe({
        next: (data: any) => {
          this.proveedor = data;
          console.log('Proveedor original (Proveedor):', this.proveedor);
          this.isLoading = false;
          this.unauthorized = false;
        },
        error: (error) => this.handleError(error)
      });
    } else {
      console.warn('Rol no reconocido:', this.rol);
      this.handleUnauthorizedAccess();
    }
  }

  handleError(error: any) {
    console.error('Error:', error);
    this.isLoading = false;
    
    if (error.status === 403) {
      this.handleUnauthorizedAccess();
    } else if (error.status === 401) {
      this.router.navigate(['/login']);
    } else {
      this.error = 'Error al cargar el perfil';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el perfil',
        confirmButtonColor: '#E82A3C'
      });
    }
  }

  handleUnauthorizedAccess() {
    this.unauthorized = true;
    this.isLoading = false;
    this.error = 'No tiene permiso para acceder a este perfil';
    
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tiene permisos para ver este perfil',
      confirmButtonColor: '#E82A3C'
    }).then(() => {
      // Redirigir según el rol
      if (this.authorizationService.isProveedor()) {
        this.router.navigate(['/homeproveedor']);
      } else if (this.authorizationService.isTurista()) {
        this.router.navigate(['/hometurista']);
      } else if (this.authorizationService.isAdmin()) {
        this.router.navigate(['/homeadmin']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  navigateTo(): void {
    if (this.authorizationService.isProveedor()) {
      this.router.navigate(['/homeproveedor']);
    } else if (this.authorizationService.isAdmin()) {
      this.router.navigate(['/proveedores']);
    } else {
      window.history.back();
    }
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
      telefono: this.proveedor.proveedorInfo?.telefono || '',
      telefonoEmpresa: this.proveedor.proveedorInfo?.telefonoEmpresa || '',
      nombre_empresa: this.proveedor.proveedorInfo?.nombre_empresa || '',
      cargoContacto: this.proveedor.proveedorInfo?.cargoContacto || '',
      coordenadaX: this.proveedor.proveedorInfo?.coordenadaX || '',
      coordenadaY: this.proveedor.proveedorInfo?.coordenadaY || '',
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