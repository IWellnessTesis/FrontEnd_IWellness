import { Routes } from '@angular/router';
import { AnalisisComponent } from './components/landing/analisis/analisis.component';
import { HomeComponent } from './components/landing/home/home.component';
import { LoginComponent } from './components/landing/login/login.component';
import { RecuperarComponent } from './components/landing/recuperar/recuperar.component';
import { RegistroComponent } from './components/landing/registro/registro.component';
import { TemasComponent } from './components/landing/temas/temas.component';
import { HeaderAdminComponent } from './components/users/administrador/header-admin/header-admin.component';
import { HomeAdminComponent } from './components/users/administrador/home-admin/home-admin.component';
import { PerfilAdminComponent } from './components/users/administrador/perfil-admin/perfil-admin.component';
import { ProveedoresComponent } from './components/users/administrador/proveedores/proveedores.component';
import { ServiciosComponent } from './components/users/administrador/servicios/servicios.component';
import { VisitantesComponent } from './components/users/administrador/visitantes/visitantes.component';
import { AgregarServicioComponent } from './components/users/proveedor/agregar-servicio/agregar-servicio.component';
import { DashboardComponent } from './components/users/proveedor/dashboard/dashboard.component';
import { EditarServicioComponent } from './components/users/proveedor/editar-servicio/editar-servicio.component';
import { HeaderProveedorComponent } from './components/users/proveedor/header-proveedor/header-proveedor.component';
import { HomeProveedorComponent } from './components/users/proveedor/home-proveedor/home-proveedor.component';
import { RegistroProveedorComponent } from './components/users/proveedor/registro-proveedor/registro-proveedor.component';
import { EditPreferenciasComponent } from './components/users/turista/edit-preferencias/edit-preferencias.component';
import { FormulariogustosComponent } from './components/users/turista/formulariogustos/formulariogustos.component';
import { HeaderTuristaComponent } from './components/users/turista/header-turista/header-turista.component';
import { HomeTuristaComponent } from './components/users/turista/home-turista/home-turista.component';
import { InfoServicioComponent } from './components/users/turista/info-servicio/info-servicio.component';
import { PerfilTuristaComponent } from './components/users/turista/perfil-turista/perfil-turista.component';
import { RegistroTuristaComponent } from './components/users/turista/registro-turista/registro-turista.component';


export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'temas', component: TemasComponent},
    { path: 'analisis', component: AnalisisComponent},
    { path: 'registro', component: RegistroComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registroturista', component: RegistroTuristaComponent},
    { path: 'recuperar', component: RecuperarComponent},
    { path: 'formulariogustos', component: FormulariogustosComponent},
    { path: 'perfilturista', component: PerfilTuristaComponent},
    { path: 'hometurista', component: HomeTuristaComponent},
    { path: 'infoservicio', component: InfoServicioComponent},
    { path: 'headerturista', component: HeaderTuristaComponent},
    { path: 'registroproveedor', component: RegistroProveedorComponent},
    { path: 'homeproveedor', component: HomeProveedorComponent},
    { path: 'agregarservicio', component: AgregarServicioComponent},
    { path: 'editarservicio', component: EditarServicioComponent},
    { path: 'dashboard', component: DashboardComponent},	
    { path: 'headerproveedor', component: HeaderProveedorComponent},
    { path: 'editpreferencias', component: EditPreferenciasComponent},
    { path: 'headeradmin', component: HeaderAdminComponent},
    { path: 'homeadmin', component: HomeAdminComponent},	
    { path: 'perfiladmin', component: PerfilAdminComponent},
    { path: 'visitantes', component: VisitantesComponent},
    { path: 'servicios', component: ServiciosComponent},
    { path: 'proveedores', component: ProveedoresComponent},
    { path: '**', redirectTo: ''} // Redirect to home
];
