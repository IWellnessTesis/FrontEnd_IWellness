import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../../../servicios/services/servicio.service';

@Component({
  selector: 'app-editar-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './editar-servicio.component.html',
  styleUrl: './editar-servicio.component.css'
})
export class EditarServicioComponent {
  // Días de la semana disponibles
  days = [
    { name: 'Lunes', selected: false },
    { name: 'Martes', selected: false },
    { name: 'Miércoles', selected: false },
    { name: 'Jueves', selected: false },
    { name: 'Viernes', selected: false },
    { name: 'Sábado', selected: false },
    { name: 'Domingo', selected: false }
  ];

  // Horario de inicio y fin
  startTime: string = '';
  endTime: string = '';

  servicio: any;

  constructor(private route: ActivatedRoute,private router: Router, private servicioService: ServicioService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.servicioService.buscarPorId(id).subscribe({
        next: data => {
          this.servicio = data;
          console.log('Horario desde backend:', this.servicio.horario);
  
          // Aquí aplicamos el parseo
          this.parseHorario(this.servicio.horario);
        }
      });
    });
  }
  private parseHorario(horario: string): void {
    if (!horario) return;
  
    const [diasParte, horaParte] = horario.split(';');
  
    const diasSeleccionados = diasParte.split(',').map(d => d.trim());
  
    this.days.forEach(day => {
      day.selected = diasSeleccionados.includes(day.name);
    });
  
    if (horaParte) {
      const horas = horaParte.split('-').map(h => h.trim());
      console.log(horaParte);
  
      // Asegurar que las horas estén en formato HH:mm
      const formatHora = (hora: string) => hora.length === 5 ? hora : (hora.length === 2 ? `${hora}:00` : '');
  
      this.startTime = formatHora(horas[0]);
      this.endTime = formatHora(horas[1]);
    }
  }
  

  // Método para generar la cadena de horario estandarizada
  getFormattedSchedule(): string {
    const selectedDays = this.days
      .filter(day => day.selected)
      .map(day => day.name)
      .join(', ');

    return selectedDays && this.startTime && this.endTime
      ? `${selectedDays}: ${this.startTime} - ${this.endTime}`
      : 'Horario no seleccionado';
      
  }
  navigateTo(path: string) {
    const horario = this.getFormattedSchedule();
    console.log('Horario formateado:', horario);
    this.router.navigate([path]);
  }

}
