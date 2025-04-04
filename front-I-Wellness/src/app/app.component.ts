import { Component } from '@angular/core';
import  { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from './features/users/administrador/header-admin/header-admin.component';
import { HeaderProveedorComponent } from './features/users/proveedor/header-proveedor/header-proveedor.component';
import { HeaderTuristaComponent } from './features/users/turista/header-turista/header-turista.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, HeaderProveedorComponent, HeaderTuristaComponent, HeaderAdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'front-I-Wellness';
  headerType: string = 'default';
  //se muestra footer o no se muestra
  showFooter: boolean = false; 

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const headersMap: { [key: string]: string } = {
          '/hometurista': 'headerturista',
          '/homeproveedor': 'headerproveedor',
          '/perfilturista': 'headerturista',
          '/infoservicio': 'headerturista',
          '/editpreferencias': 'headerturista',
          '/agregarservicio': 'headerproveedor',
          '/editarservicio': 'headerproveedor',
          '/dashboard': 'headerproveedor',
          '/homeadmin': 'headeradmin',
          '/perfiladmin': 'headeradmin',
          '/visitantes': 'headeradmin',
          '/servicios': 'headeradmin',
          '/proveedores': 'headeradmin'
        };

        // Asigna el header según la ruta, usa 'default' si no está en el mapa
        this.headerType = headersMap[event.url] || 'default';
        //rutas en las que se permite el header
        const allowedRoutes = ['/', '/temas', '/analisis'];
        this.showFooter = allowedRoutes.includes(event.url);
      
      }
    });
  }

}
