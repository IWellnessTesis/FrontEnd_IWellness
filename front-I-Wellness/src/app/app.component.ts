import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from './features/users/administrador/header-admin/header-admin.component';
import { HeaderProveedorComponent } from './features/users/proveedor/header-proveedor/header-proveedor.component';
import { HeaderTuristaComponent } from './features/users/turista/header-turista/header-turista.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    HeaderProveedorComponent,
    HeaderTuristaComponent,
    HeaderAdminComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title: string = 'front-I-Wellness';
  headerType: string = 'default';
  //se muestra footer o no se muestra
  showFooter: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;

        if (
          url.startsWith('/hometurista') ||
          url.startsWith('/perfilturista') ||
          url.startsWith('/infoservicio') ||
          url.startsWith('/editpreferencias') ||
          url.startsWith('/mapaempresas')
        ) {
          this.headerType = 'headerturista';
        } else if (
          url.startsWith('/homeproveedor') ||
          url.startsWith('/agregarservicio') ||
          url.startsWith('/editarservicio') ||
          url.startsWith('/dashboard')
        ) {
          this.headerType = 'headerproveedor';
        } else if (
          url.startsWith('/homeadmin') ||
          url.startsWith('/perfiladmin') ||
          url.startsWith('/visitantes') ||
          url.startsWith('/servicios') ||
          url.startsWith('/proveedores')
        ) {
          this.headerType = 'headeradmin';
        } else {
          this.headerType = 'default';
        }

        // Footer logic (esto también podrías adaptarlo si las rutas tienen parámetros)
        const allowedRoutes = ['/', '/temas', '/analisis'];
        this.showFooter = allowedRoutes.includes(url);
      }
    });
  }
}
