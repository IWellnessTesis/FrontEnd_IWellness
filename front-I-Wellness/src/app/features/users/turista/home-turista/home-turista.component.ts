import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../../../servicios/services/servicio.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { TuristaXPreferenciaService } from '../../../preferencias/services/turistaXpreferencias/turista-xpreferencia.service';
import { ServicioXPreferenciaService } from '../../../preferencias/services/servicioXpreferencias/servicio-xpreferencia.service';
import { CommonModule } from '@angular/common';
import { PreferenciasService } from '../../../preferencias/services/preferencias/preferencias.service';
import { forkJoin } from 'rxjs';

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
  preferencias: any;
  serviciosAgrupadosPorPreferencia :any;

  constructor(
    private router: Router, 
    private servicioService: ServicioService, 
    private authService: AuthService, 
    private turistaXPreferencia: TuristaXPreferenciaService, 
    private servicioXPreferencia: ServicioXPreferenciaService,
    private preferenciasService: PreferenciasService, 
  ) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

ngOnInit(): void {
  // Ejecutar las peticiones de manera concurrente
  forkJoin({
    servicios: this.servicioService.obtenerTodos(),
    preferencias: this.preferenciasService.obtenerPreferencias(),
    preferenciasServicio: this.servicioXPreferencia.obtenerTodos(),
    usuario: this.authService.usuarioHome()
  }).subscribe({
    next: ({ servicios, preferencias, preferenciasServicio, usuario }) => {
      // Asignar los resultados de las peticiones a las variables correspondientes
      this.servicios = servicios;
      this.preferencias = preferencias;
      this.preferenciasServicio = preferenciasServicio;
      this.usuario = JSON.parse(usuario); 

      // Llamar a las funciones necesarias después de obtener los datos
      this.cargarPreferenciasUsuario();  
      this.agruparServiciosPorTodasLasPreferencias();
    },
    error: (err) => {
      console.error('Error al cargar los datos:', err);
    }
  });
}

cargarPreferenciasUsuario() {
  this.turistaXPreferencia.obtenerPorTurista(this.usuario.id).subscribe({
    next: (data: any) => {
      this.preferenciasUsuario = data;
      // Ahora podemos proceder a filtrar los servicios
      this.filtrarServiciosPorPreferenciasUsuario();
    },
    error: (err: any) => {
      console.error('Error al obtener preferencias del usuario:', err);
    }
  });
}

  cargarPreferencias() {
    this.preferenciasService.obtenerPreferencias().subscribe({
      next: (data) => {
        this.preferencias = data;
        console.log('Preferencias cargadas:', this.preferencias);
      },
      error: (error) => {
        console.error('Error al obtener preferencias:', error);
        // En caso de error, cargar preferencias predeterminadas
      }
    });
  }

  agruparServiciosPorTodasLasPreferencias(): void {
  this.serviciosAgrupadosPorPreferencia = [];

  this.preferencias.forEach((preferencia: any) => {
    const serviciosCoincidentes = this.servicios.filter((servicio: any) => {
      const prefsDelServicio = this.preferenciasServicio.filter(
        (ps: any) => ps.idServicio === servicio._idServicio
      );
      return prefsDelServicio.some(
        (ps: any) => ps.preferencia._idPreferencias === preferencia._idPreferencias
      );
    });

    if (serviciosCoincidentes.length > 0) {
      this.serviciosAgrupadosPorPreferencia.push({
        preferencia: preferencia,
        servicios: serviciosCoincidentes
      });
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
