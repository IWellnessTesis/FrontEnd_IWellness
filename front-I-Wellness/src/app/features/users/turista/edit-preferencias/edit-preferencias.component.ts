import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { PreferenciasService } from '../../../preferencias/services/preferencias/preferencias.service';
import { TuristaXPreferenciaService } from '../../../preferencias/services/turistaXpreferencias/turista-xpreferencia.service';

@Component({
  selector: 'app-edit-preferencias',
  imports: [CommonModule],
  templateUrl: './edit-preferencias.component.html',
  styleUrl: './edit-preferencias.component.css'
})
export class EditPreferenciasComponent {

  seleccionados: any[] = [];
  preferencias: any[] = [];
  idUsuario!: number;



  seleccionarGusto(item: any) {
    const index = this.seleccionados.indexOf(item);
    if (index > -1) {
      this.seleccionados.splice(index, 1); // Si ya está seleccionado, se deselecciona
    } else if (this.seleccionados.length < 5) {
      this.seleccionados.push(item); // Agregar a seleccionados si hay espacio
    }
  }
  constructor(  
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private preferenciasService: PreferenciasService,
    private turistaXPreferencia: TuristaXPreferenciaService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idUsuario = +id;
        console.log('ID del usuario:', this.idUsuario);
        this.cargarPreferencias();
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

  agregarPreferencias() {
    if (this.seleccionados.length < 3 || this.seleccionados.length > 5) {
      alert('Debes seleccionar entre 3 y 5 preferencias.');
      return;
    }
  
    if (!this.idUsuario) {
      console.error('No se encontró el ID del usuario.');
      return;
    }
  
    console.log('Eliminando preferencias previas del usuario:', this.idUsuario);
  
    // Paso 1: Eliminar todas las preferencias anteriores
    this.turistaXPreferencia.eliminarPreferenciasPorTurista(this.idUsuario).subscribe({
      next: () => {
        console.log('Preferencias anteriores eliminadas. Procediendo a guardar nuevas preferencias.');
        this.guardarNuevasPreferencias(); // Paso 2
      },
      error: (err: any) => {
        console.error('Error al eliminar preferencias anteriores:', err);
        alert('No se pudieron eliminar las preferencias previas. Intenta nuevamente.');
      }
    });
  }
  
  guardarNuevasPreferencias() {
    const peticiones = this.seleccionados.map(pref => {
      const turistaXPreferencia = {
        idUsuario: this.idUsuario,
        preferencia: {
          _idPreferencias: pref._idPreferencias || pref.id
        }
      };
      return this.turistaXPreferencia.crear(turistaXPreferencia);
    });
  
    let exitos = 0;
    let errores = 0;
  
    peticiones.forEach((peticion, i) => {
      peticion.subscribe({
        next: () => {
          exitos++;
          if (exitos + errores === peticiones.length) {
            this.finalizarGuardado(exitos, errores);
          }
        },
        error: (err) => {
          errores++;
          console.error('Error al guardar preferencia:', err);
          if (exitos + errores === peticiones.length) {
            this.finalizarGuardado(exitos, errores);
          }
        }
      });
    });
  }
  
  finalizarGuardado(exitos: number, errores: number) {
  
    // Obtener el rol del usuario desde el localStorage
    const rol = localStorage.getItem('rol');  // Aquí asumimos que el rol está guardado en localStorage con la clave 'rol'
  
    // Verificar el rol y redirigir a la página correspondiente
    if (rol === 'Admin') {
      this.router.navigate(['/visitantes']);
    } else if (rol === 'Turista') {
      this.router.navigate(['/hometurista']);
    } else {
      // Si no se encuentra un rol válido, podrías redirigir a una página predeterminada o mostrar un mensaje de error
      console.log('Rol no encontrado, redirigiendo a la página de inicio...');
      this.router.navigate(['/inicio']);
    }
  }
  
  


}
