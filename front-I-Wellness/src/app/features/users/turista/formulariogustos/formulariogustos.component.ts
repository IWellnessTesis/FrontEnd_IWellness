import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PreferenciasService } from '../../../preferencias/services/preferencias/preferencias.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { TuristaXPreferenciaService } from '../../../preferencias/services/turistaXpreferencias/turista-xpreferencia.service';

@Component({
  selector: 'app-formulariogustos',
  imports: [CommonModule],
  templateUrl: './formulariogustos.component.html',
  styleUrl: './formulariogustos.component.css'
})
export class FormulariogustosComponent {

  seleccionados: any[] = [];

    usuario: any;
    correoUsuario: any;
    preferencias: any;

  seleccionarGusto(item: any) {
    const index = this.seleccionados.indexOf(item);
    if (index > -1) {
      this.seleccionados.splice(index, 1); // Si ya está seleccionado, se deselecciona
    } else if (this.seleccionados.length < 5) {
      this.seleccionados.push(item); // Agregar a seleccionados si hay espacio
    }
  }
  constructor(private router: Router, private preferenciasServicio: PreferenciasService, private usuarioServicio: UsuarioService, private turistaXPreferencia: TuristaXPreferenciaService) {}

  ngOnInit(): void {
    this.correoUsuario = localStorage.getItem('registeredEmail');
    this.usuarioServicio.obtenerPorCorreo(this.correoUsuario).subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      }
    });

    this.preferenciasServicio.obtenerPreferencias().subscribe({
      next: (preferencias) => {
        this.preferencias = preferencias;
      },
      error: (err) => {
        console.error('Error al obtener las preferencias:', err);
      }
    })
  }

  agregarPreferencias() {
    if (this.seleccionados.length >= 3 && this.seleccionados.length <= 5) {
      const idUsuario = this.usuario.id;
  
      const peticiones = this.seleccionados.map(pref => {
        const turistaXPreferencia = {
          idUsuario: idUsuario,
          preferencia: {
            _idPreferencias: pref._idPreferencias // asegúrate de que pref.id corresponda al _idPreferencias
          }
        };
        return this.turistaXPreferencia.crear(turistaXPreferencia).toPromise();
      });
  
      Promise.all(peticiones)
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch(error => {
          console.error('Error al asociar preferencias:', error);
          alert('Hubo un problema al guardar tus preferencias. Intenta de nuevo.');
        });
  
    } else {
      alert('Debes seleccionar entre 3 y 5 opciones.');
    }
  }

}
