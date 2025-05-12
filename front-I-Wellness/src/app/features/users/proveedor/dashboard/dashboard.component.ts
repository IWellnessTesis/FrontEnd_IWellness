import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts'; // Importar NgxChartsModule
import { ViewEncapsulation } from '@angular/core';

// Definir una interfaz para los datos de servicio
interface Preferencia {
  genero: string;
  estadoCivil: string;
  intereses: string;
  total: number;
}

interface Interes {
  pais: string;
  intereses: string;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [NgxChartsModule],
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  preferencias: Preferencia[] = [];  // Tipo explícito para preferencias
  intereses: Interes[] = [];  // Tipo explícito para intereses
  barChartData: any[] = [];
  estadoCivilChartData: any[] = [];
  interesesChart: any[] = [];
  totalTuristas: number = 0;
  topPais: string = '';
  topPaisTotal: number = 0;
  generoTuristasChart: any[] = [];
  serviciosPopularesChart: any[] = [];

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#6C63FF', '#20c997', '#fd7e14', '#ffc107', '#343a40']
  };

  xAxisTickFormatting = (label: string) => label; // No rota, muestra completo si cabe

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarGraficasProveedor();

  }

  cargarGraficasProveedor() {
  // Preferencias por Estado Civil (agrupadas)
  this.http.get<any[]>('http://localhost:5000/api/preferencias-usuario').subscribe(data => {
    const grouped: { [pref: string]: { [estado: string]: number } } = {};
    data
      .filter(item => item.estadoCivil === 'Casado/a' || item.estadoCivil === 'Soltero/a')
      .forEach(item => {
        const cadena = item.intereses;
        if (cadena) {
          const preferencias = cadena.split(',').map((pref: string) => pref.trim());
          preferencias.forEach((pref: string) => {
            if (!grouped[pref]) grouped[pref] = {};
            grouped[pref][item.estadoCivil] = (grouped[pref][item.estadoCivil] || 0) + item.total;
          });
        }
      });
    this.estadoCivilChartData = Object.keys(grouped).map(pref => ({
      name: pref,
      series: [
        { name: 'Casado/a', value: grouped[pref]['Casado/a'] || 0 },
        { name: 'Soltero/a', value: grouped[pref]['Soltero/a'] || 0 }
      ]
    }));
  });

  // Intereses por País (solo el más popular por país)
  this.http.get<any[]>('http://localhost:5000/api/intereses-usuario').subscribe(data => {
    const paisInteresMap: { [pais: string]: { interes: string, total: number } } = {};
    data.forEach(item => {
      const intereses = item.intereses.split(',').map((i: string) => i.trim());
      intereses.forEach((interes: string) => {
        if (!paisInteresMap[item.pais] || paisInteresMap[item.pais].total < item.total) {
          paisInteresMap[item.pais] = { interes, total: item.total };
        }
      });
    });
    this.interesesChart = Object.keys(paisInteresMap)
      .map(pais => ({
        name: `${pais}: ${paisInteresMap[pais].interes}`,
        value: paisInteresMap[pais].total
      }))
      .sort((a, b) => b.value - a.value);
      // Encuentra el país con mayor total
      if (this.interesesChart.length > 0) {
        const top = this.interesesChart.reduce((prev, curr) => (curr.value > prev.value ? curr : prev));
        // El nombre está en formato "Pais: Interes", así que extrae solo el país
        this.topPais = top.name.split(':')[0];
        this.topPaisTotal = top.value;
      }
  });

  this.http.get<{total: number}>('http://localhost:5000/api/turistas').subscribe(data => {
    console.log('Datos recibidos Turista:', data); // DEBUG
    this.totalTuristas = data.total;
  });

  this.http.get<any[]>('http://localhost:5000/api/turistas-genero').subscribe(data => {
    this.generoTuristasChart = data.map(item => ({
      name: item.genero,
      value: item.total
    }));
  });

  this.http.get<any[]>('http://localhost:5000/api/servicios-mas-solicitados').subscribe(data => {
    // Crear un mapa para contar las ocurrencias de cada interés
    const interesesCount: { [key: string]: number } = {};
    
    data.forEach(item => {
      // Dividir los intereses por comas y procesar cada uno
      const intereses = item.intereses.split(',').map((i: string) => i.trim());
      intereses.forEach((interes: string) => {
        interesesCount[interes] = (interesesCount[interes] || 0) + item.total;
      });
    });

    // Convertir el mapa a un array y ordenar por total
    this.serviciosPopularesChart = Object.entries(interesesCount)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Tomar solo los top 10
  });

}
}
