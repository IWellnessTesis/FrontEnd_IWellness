import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { jwtDecode } from 'jwt-decode';

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

interface Usuario {
  proveedor: {
    nombre_empresa: string;
  };
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
  usuario: Usuario | null = null;
  nombreEmpresa: string = '';

  // Datos proveedor
  activos = 0;
  inactivos = 0;

  // Datos admin o generales
  totalServicios = 0;
  totalTuristas = 0;

  // Gráficos
  estadoCivilChartData: any[] = [];
  interesesChart: any[] = [];
  generoTuristasChart: any[] = [];
  serviciosPopularesChart: any[] = [];
  reservasPorServicioChart: any[] = [];
  generoReservasChart: any[] = [];
  estadoReservasChart: any[] = [];
  // Nuevas propiedades
servicios: any[] = [];
totalReservas = 0;
reservasPorServicio: any[] = [];
reservasPorEstado: any[] = [];
reservasPorGenero: any[] = [];
reservasPorNacionalidad: any[] = [];
reservasPorGeneroChart: any[] = [];
  // Otros
  topPais = '';
  topPaisTotal = 0;

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#6C63FF', '#20c997', '#fd7e14', '#ffc107', '#343a40']
  };
xAxisTickFormatting: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    console.log(JSON.parse(atob(token.split('.')[1])));

    const decoded: any = jwtDecode(token);
    const idProveedor = decoded.idProveedor;

    if (!idProveedor) {
      console.error('ID de proveedor no encontrado en el token');
      return;
    }

    this.cargarDatosGenerales();
    this.cargarDatosProveedor(idProveedor);
    this.cargarGraficasProveedor();
  }

  cargarDatosGenerales(): void {
    this.http.get<any>('http://localhost:5000/api/dashboard-admin').subscribe(
      data => this.totalServicios = data.total_servicios,
      error => console.error('Error dashboard-admin', error)
    );

    this.http.get<{ total: number }>('http://localhost:5000/api/turistas').subscribe(
      data => this.totalTuristas = data.total,
      error => console.error('Error total turistas', error)
    );

    this.http.get<any[]>('http://localhost:5000/api/turistas-genero').subscribe(
      data => this.generoTuristasChart = data.map(item => ({ name: item.genero, value: item.total })),
      error => console.error('Error turistas-genero', error)
    );

    this.http.get<any[]>('http://localhost:5000/api/servicios-mas-solicitados').subscribe(
      data => {
        const interesesCount: { [key: string]: number } = {};
        data.forEach(item => {
          item.intereses.split(',').forEach((interes: string) => {
            interes = interes.trim();
            interesesCount[interes] = (interesesCount[interes] || 0) + item.total;
          });
        });

        this.serviciosPopularesChart = Object.entries(interesesCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      },
      error => console.error('Error servicios-mas-solicitados', error)
    );
  }

  cargarDatosProveedor(idProveedor: string): void {
    // Limpia los datos antes de cargar nuevos
    this.nombreEmpresa = '';
    this.usuario = null;
    this.activos = 0;
    this.inactivos = 0;

  this.http.get<any>(`http://localhost:5000/api/dashboard-proveedor?idProveedor=${idProveedor}`).subscribe(
    data => {
      this.nombreEmpresa = data.nombre_empresa;
      console.log('Nombre empresa actualizado:', this.nombreEmpresa);
      this.usuario = { proveedor: { nombre_empresa: data.nombre_empresa } };
      this.activos = data.activos;
      this.inactivos = data.inactivos;
    },
    error => console.error('Error dashboard-proveedor', error)
  );

  // NUEVOS ENDPOINTS:
  this.http.get<any[]>(`http://localhost:5000/api/proveedor/lista-servicios?idProveedor=${idProveedor}`)
    .subscribe(data => this.servicios = data);

  this.http.get<any>(`http://localhost:5000/api/proveedor/total-reservas?idProveedor=${idProveedor}`)
    .subscribe(data => this.totalReservas = data.total_reservas);

    this.http.get<any[]>(`http://localhost:5000/api/reservas-por-servicio?idProveedor=${idProveedor}`)
    .subscribe(data => {
      this.reservasPorServicioChart = data.map(r => ({
        name: r.serviceName,
        value: r.total_reservas
      }));
    });
  this.http.get<any[]>(`http://localhost:5000/api/proveedor/reservas-por-estado?idProveedor=${idProveedor}`)
    .subscribe(data => this.reservasPorEstado = data);

    this.http.get<any[]>(`http://localhost:5000/api/reservas-genero-proveedor?idProveedor=${idProveedor}`)
    .subscribe(data => {
      this.reservasPorGeneroChart = data.map(r => ({
        name: r.genero,
        value: r.total
      }));
    });

  this.http.get<any[]>(`http://localhost:5000/api/proveedor/reservas-por-nacionalidad?idProveedor=${idProveedor}`)
    .subscribe(data => this.reservasPorNacionalidad = data);

  }

  cargarGraficasProveedor(): void {
    this.http.get<any[]>('http://localhost:5000/api/preferencias-usuario').subscribe(data => {
      const grouped: { [pref: string]: { [estado: string]: number } } = {};
      data
        .filter(item => item.estadoCivil === 'Casado/a' || item.estadoCivil === 'Soltero/a')
        .forEach(item => {
          item.intereses.split(',').map((i: string) => i.trim()).forEach((pref: string | number) => {
            grouped[pref] = grouped[pref] || {};
            grouped[pref][item.estadoCivil] = (grouped[pref][item.estadoCivil] || 0) + item.total;
          });
        });

      this.estadoCivilChartData = Object.keys(grouped).map(pref => ({
        name: pref,
        series: [
          { name: 'Casado/a', value: grouped[pref]['Casado/a'] || 0 },
          { name: 'Soltero/a', value: grouped[pref]['Soltero/a'] || 0 }
        ]
      }));
    });

    this.http.get<any[]>('http://localhost:5000/api/intereses-usuario').subscribe(data => {
      const paisInteresMap: { [pais: string]: { interes: string, total: number } } = {};
      data.forEach(item => {
        const intereses = item.intereses.split(',').map((i: string) => i.trim());
        intereses.forEach((interes: any) => {
          if (!paisInteresMap[item.pais] || paisInteresMap[item.pais].total < item.total) {
            paisInteresMap[item.pais] = { interes, total: item.total };
          }
        });
      });

      this.interesesChart = Object.keys(paisInteresMap).map(pais => ({
        name: `${pais}: ${paisInteresMap[pais].interes}`,
        value: paisInteresMap[pais].total
      })).sort((a, b) => b.value - a.value);

      if (this.interesesChart.length > 0) {
        const top = this.interesesChart.reduce((prev, curr) => (curr.value > prev.value ? curr : prev));
        this.topPais = top.name.split(':')[0];
        this.topPaisTotal = top.value;
      }
    });
  }
}
