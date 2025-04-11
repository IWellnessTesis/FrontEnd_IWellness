import { Routes } from '@angular/router';
import { AnalisisComponent } from './features/analisis/analisis.component';
import { HomeComponent } from './features/landing/home/home.component';
import { LoginComponent } from './features/landing/login/login.component';
import { RecuperarComponent } from './features/landing/recuperar/recuperar.component';
import { RegistroComponent } from './features/landing/registro/registro.component';
import { TemasComponent } from './features/landing/temas/temas.component';
import { HeaderAdminComponent } from './features/users/administrador/header-admin/header-admin.component';
import { HomeAdminComponent } from './features/users/administrador/home-admin/home-admin.component';
import { PerfilAdminComponent } from './features/users/administrador/perfil-admin/perfil-admin.component';
import { ProveedoresComponent } from './features/users/administrador/proveedores/proveedores.component';
import { ServiciosComponent } from './features/users/administrador/servicios/servicios.component';
import { VisitantesComponent } from './features/users/administrador/visitantes/visitantes.component';
import { AgregarServicioComponent } from './features/users/proveedor/agregar-servicio/agregar-servicio.component';
import { DashboardComponent } from './features/users/proveedor/dashboard/dashboard.component';
import { EditarServicioComponent } from './features/users/proveedor/editar-servicio/editar-servicio.component';
import { HeaderProveedorComponent } from './features/users/proveedor/header-proveedor/header-proveedor.component';
import { HomeProveedorComponent } from './features/users/proveedor/home-proveedor/home-proveedor.component';
import { RegistroProveedorComponent } from './features/users/proveedor/registro-proveedor/registro-proveedor.component';
import { EditPreferenciasComponent } from './features/users/turista/edit-preferencias/edit-preferencias.component';
import { FormulariogustosComponent } from './features/users/turista/formulariogustos/formulariogustos.component';
import { HeaderTuristaComponent } from './features/users/turista/header-turista/header-turista.component';
import { HomeTuristaComponent } from './features/users/turista/home-turista/home-turista.component';
import { InfoServicioComponent } from './features/users/turista/info-servicio/info-servicio.component';
import { PerfilTuristaComponent } from './features/users/turista/perfil-turista/perfil-turista.component';
import { RegistroTuristaComponent } from './features/users/turista/registro-turista/registro-turista.component';



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
    { path: 'infoservicio/:id', component: InfoServicioComponent},
    { path: 'headerturista', component: HeaderTuristaComponent},
    { path: 'registroproveedor', component: RegistroProveedorComponent},
    { path: 'homeproveedor', component: HomeProveedorComponent},
    { path: 'agregarservicio', component: AgregarServicioComponent},
    { path: 'editarservicio/:id', component: EditarServicioComponent},
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
