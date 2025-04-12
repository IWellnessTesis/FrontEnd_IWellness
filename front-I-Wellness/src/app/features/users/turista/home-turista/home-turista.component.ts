import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../../../servicios/services/servicio.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { TuristaXPreferenciaService } from '../../../preferencias/services/turistaXpreferencias/turista-xpreferencia.service';
import { ServicioXPreferenciaService } from '../../../preferencias/services/servicioXpreferencias/servicio-xpreferencia.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-turista',
  imports: [CommonModule],
  templateUrl: './home-turista.component.html',
  styleUrl: './home-turista.component.css'
})
export class HomeTuristaComponent {

  servicios: any;
  correoUsuario: any;
  usuario: any;
  preferenciasUsuario: any;
  preferenciasServicio: any;
  serviciosFiltrados: any;

  constructor(private router: Router, private servicioService: ServicioService, private usuarioServicio: UsuarioService, 
    private authService: AuthService, private turistaXPreferencia: TuristaXPreferenciaService, 
    private servicioXPreferencia: ServicioXPreferenciaService ) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    // Obtener todos los servicios
    this.servicioService.obtenerTodos().subscribe({
      next: (data) => {
        this.servicios = data;
      }
    });
  
    // Obtener todas las preferencias por servicio
    this.servicioXPreferencia.obtenerTodos().subscribe({
      next: (data: any) => {
        this.preferenciasServicio = data;
      }
    });
  
  
    const cargarPreferenciasUsuario = () => {
      this.turistaXPreferencia.obtenerPorTurista(this.usuario.id).subscribe({
        next: (data: any) => {
          this.preferenciasUsuario = data;
  
          // Llamar función para filtrar servicios
          this.filtrarServiciosPorPreferenciasUsuario();
        },
        error: (err: any) => {
          console.error('Error al obtener preferencias del usuario:', err);
        }
      });
    };
  

      this.authService.usuarioHome().subscribe({
        next: (data: string) => {
          this.usuario = JSON.parse(data);
          cargarPreferenciasUsuario();
        },
        error: (err: any) => {
          console.error('Error al obtener el usuario:', err);
        }
      });
    
  }

  
  filtrarServiciosPorPreferenciasUsuario(): void {
    this.serviciosFiltrados = this.servicios.filter((servicio: { _idServicio: any; }) => {
      const preferenciasServicio = this.preferenciasServicio.filter((p: { idServicio: any; }) => p.idServicio === servicio._idServicio);
      return preferenciasServicio.some((prefServicio: { preferencia: { _idPreferencias: any; }; }) =>
        this.preferenciasUsuario.some((prefUsuario: { preferencia: { _idPreferencias: any; }; }) =>
          prefUsuario.preferencia._idPreferencias === prefServicio.preferencia._idPreferencias
        )
      );
    });

  }

  navigateToDetalle(id: number) {
    this.router.navigate(['/infoservicio/', id]);
  }
  
}
