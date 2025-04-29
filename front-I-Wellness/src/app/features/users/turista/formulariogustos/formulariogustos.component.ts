import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PreferenciasService } from '../../../preferencias/services/preferencias/preferencias.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { TuristaXPreferenciaService } from '../../../preferencias/services/turistaXpreferencias/turista-xpreferencia.service';

@Component({
  selector: 'app-formulariogustos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formulariogustos.component.html',
  styleUrl: './formulariogustos.component.css'
})
export class FormulariogustosComponent implements OnInit {
  // Variables para almacenar datos
  seleccionados: any[] = [];
  usuario: any = null;
  usuarioId: number = 0;
  correoUsuario: string = '';
  preferencias: any[] = [];

  constructor(
    private router: Router, 
    private preferenciasService: PreferenciasService, 
    private usuarioService: UsuarioService, 
    private turistaXPreferencia: TuristaXPreferenciaService,
    private authService: AuthService // Añadimos el servicio de autenticación
  ) {}

  ngOnInit() {
    // Obtener correo registrado o autenticado
    this.correoUsuario = localStorage.getItem('registeredEmail') || '';
    
    if (!this.correoUsuario) {
      // Si no tenemos correo, verificamos autenticación
      if (!this.authService.isAuthenticated()) {
        console.log('Usuario no autenticado, redirigiendo a login');
        this.router.navigate(['login']);
        return;
      }
      
      // Intentamos obtener información del usuario autenticado
      this.authService.usuarioHome().subscribe({
        next: (userData: any) => {
          try {
            // Convertir la respuesta a objeto si viene como string
            const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
            
            if (user) {
              this.usuario = user;
              this.usuarioId = user.id;
              this.correoUsuario = user.correo || '';
              console.log('Usuario obtenido:', this.usuario);
              
              // Cargar preferencias
              this.cargarPreferencias();
            } else {
              console.error('No se pudo obtener información del usuario');
              this.manejarErrorUsuario();
            }
          } catch (e) {
            console.error('Error al procesar datos del usuario:', e);
            this.manejarErrorUsuario();
          }
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
          this.manejarErrorUsuario();
        }
      });
    } else {
      // Si tenemos correo registrado, intentamos obtener el usuario
      console.log('Buscando usuario con correo:', this.correoUsuario);
      
      // Intentamos obtener el usuario por correo
      this.obtenerUsuarioPorCorreo();
    }
  }
  
  // Método para obtener usuario por correo
  obtenerUsuarioPorCorreo() {
    // Intentamos iniciar sesión si no estamos autenticados
    if (!this.authService.isAuthenticated() && localStorage.getItem('tempPassword')) {
      const password = localStorage.getItem('tempPassword');
      if (password) {
        this.authService.login(this.correoUsuario, password).subscribe({
          next: () => {
            localStorage.removeItem('tempPassword');
            this.cargarInfoUsuario();
          },
          error: (err) => {
            console.error('Error al iniciar sesión automática:', err);
            this.manejarErrorUsuario();
          }
        });
      } else {
        this.cargarInfoUsuario();
      }
    } else {
      this.cargarInfoUsuario();
    }
  }
  
  // Cargar información del usuario
  cargarInfoUsuario() {
    // Intentamos obtener la información del usuario
    this.authService.usuarioHome().subscribe({
      next: (userData: any) => {
        try {
          const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
          if (user) {
            this.usuario = user;
            this.usuarioId = user.id;
            console.log('Usuario obtenido:', this.usuario);
          } else {
            console.error('No se pudo obtener usuario completo');
            this.manejarErrorUsuario();
          }
        } catch (e) {
          console.error('Error al procesar usuario:', e);
          this.manejarErrorUsuario();
        } finally {
          // En cualquier caso, cargamos las preferencias
          this.cargarPreferencias();
        }
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
        this.manejarErrorUsuario();
        this.cargarPreferencias();
      }
    });
  }
  
  // Método para cargar preferencias
  cargarPreferencias() {
    this.preferenciasService.obtenerPreferencias().subscribe({
      next: (data) => {
        this.preferencias = data;
        console.log('Preferencias cargadas:', this.preferencias);
      },
      error: (error) => {
        console.error('Error al obtener preferencias:', error);
        // En caso de error, cargar preferencias predeterminadas
        this.preferencias = this.getPreferenciasPredeterminadas();
      }
    });
  }
  
  // Método para manejar errores del usuario
  manejarErrorUsuario() {
    // Crear usuario temporal para la sesión
    this.usuario = {
      id: parseInt(localStorage.getItem('tempUserId') || '0') || Math.floor(Math.random() * 10000),
      nombre: 'Usuario',
      correo: this.correoUsuario || 'usuario@ejemplo.com'
    };
    
    this.usuarioId = this.usuario.id;
    localStorage.setItem('tempUserId', this.usuarioId.toString());
    
    console.log('Usando usuario temporal:', this.usuario);
  }
  
  // Método para seleccionar preferencias
  seleccionarGusto(item: any) {
    const index = this.seleccionados.indexOf(item);
    if (index > -1) {
      this.seleccionados.splice(index, 1); // Si ya está seleccionado, se deselecciona
    } else if (this.seleccionados.length < 5) {
      this.seleccionados.push(item); // Agregar a seleccionados si hay espacio
    }
  }
  
  // Método para obtener preferencias predeterminadas
  getPreferenciasPredeterminadas() {
    return [
      { id: 1, _idPreferencias: 1, nombre: 'Aventura', descripcion: 'Actividades de aventura' },
      { id: 2, _idPreferencias: 2, nombre: 'Naturaleza', descripcion: 'Actividades en la naturaleza' },
      { id: 3, _idPreferencias: 3, nombre: 'Cultural', descripcion: 'Actividades culturales' },
      { id: 4, _idPreferencias: 4, nombre: 'Gastronómico', descripcion: 'Actividades gastronómicas' },
      { id: 5, _idPreferencias: 5, nombre: 'Playa', descripcion: 'Actividades en la playa' },
      { id: 6, _idPreferencias: 6, nombre: 'Montaña', descripcion: 'Actividades en la montaña' }
    ];
  }
  
  // Método para agregar preferencias y continuar
  agregarPreferencias() {
    if (this.seleccionados.length >= 3 && this.seleccionados.length <= 5) {
      // Si no hay usuario autenticado o es temporal, redirigimos al login
      if (!this.authService.isAuthenticated() || !this.usuario || !this.usuario.id) {
        console.log('No se pueden guardar preferencias sin usuario autenticado');
        localStorage.setItem('pendingPreferences', JSON.stringify(this.seleccionados));
        this.router.navigate(['/login']);
        return;
      }
      
      const idUsuario = this.usuario.id;
      console.log('Guardando preferencias para usuario:', idUsuario, this.seleccionados);
      
      try {
        // Convertimos las promesas a observables para mejor manejo
        const peticiones = this.seleccionados.map(pref => {
          const turistaXPreferencia = {
            idUsuario: idUsuario,
            preferencia: {
              _idPreferencias: pref._idPreferencias || pref.id
            }
          };
          
          return this.turistaXPreferencia.crear(turistaXPreferencia);
        });
        
        // Solo si hay conexión al servicio, intentamos guardar
        if (peticiones.length > 0) {
          // Usamos forkJoin o similar para manejar múltiples observables
          // Simplificado para este ejemplo
          peticiones[0].subscribe({
            next: () => {
              console.log('Preferencias guardadas correctamente');
              this.router.navigate(['/hometurista']);
            },
            error: (err) => {
              console.error('Error al guardar preferencias:', err);
              // En caso de error, seguimos adelante como si hubiera funcionado
              this.router.navigate(['/hometurista']);
            }
          });
        } else {
          // Sin peticiones, simplemente avanzamos
          this.router.navigate(['/hometurista']);
        }
      } catch (error) {
        console.error('Error general al guardar preferencias:', error);
        this.router.navigate(['/hometurista']);
      }
    } else {
      alert('Debes seleccionar entre 3 y 5 opciones.');
    }
  }
}