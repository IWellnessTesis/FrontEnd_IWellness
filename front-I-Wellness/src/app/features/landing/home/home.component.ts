import { Component } from '@angular/core';
import { PieChartModule } from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PieChartModule, NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: []
})
export class HomeComponent {

  //DASHBOARD
  //PRODUCTOS
  productosData = [
    { name: 'Alimentación saludable', value: 1 },
    { name: 'Eco-lodge', value: 1 },
    { name: 'Glamping', value: 1 },
    { name: 'Productos de cuidado personal', value: 1 },
    { name: 'Finca agroecológica', value: 1 }
  ];

  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;

  constructor() {}

  ngOnInit(): void {}

  //NACIONALIDADES
  nacionalidadesData = [
    { name: 'Costa Rica', value: 3 },
    { name: 'América del Norte', value: 3 },
    { name: 'América del Sur', value: 1 },
    { name: 'Europa Occidental', value: 3 },
    { name: 'Europa del Sur', value: 2},
    { name: 'Asia Oriental', value: 1}
  ];

  //ACTIVIDADES
  actividadesVisitantesData = [
    { name: 'Relajación y descanso', value: 1 },
    { name: 'Conexión con la naturaleza', value: 3 },
    { name: 'Experiencia Bienestar Holística', value: 1 },
    { name: 'Recuperación de salud', value: 3 },
    { name: 'Turismo Espiritual', value: 1 },
    { name: 'Aventura en la naturaleza', value: 1},
    { name: 'Experiencia rural', value: 1}
  ];
  
  //TEMPORADA
  temporadaLineData = [
    {
      name: 'Visitas por temporada',
      series: [
        { name: 'Temporada Baja', value: 1 },
        { name: 'Temporada Media', value: 2 },
        { name: 'Temporada Alta', value: 5 }
      ]
    }
  ];
  
  

}
