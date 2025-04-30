import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8082/admin'; // La URL base de tu API (cambiar según el entorno)

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  obtenerTodosLosUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  // Obtener todos los turistas
  obtenerTuristas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/turistas`);
  }

  // Obtener todos los proveedores
  obtenerProveedores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/proveedores`);
  }

  // Obtener usuario por ID
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`);
  }

  // Crear un nuevo turista
  crearTurista(turistaDTO: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/turistas`, turistaDTO);
  }

  // Crear un nuevo proveedor
  crearProveedor(proveedorDTO: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/proveedores`, proveedorDTO);
  }

  // Actualizar un turista
  actualizarTurista(id: number, turistaDTO: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/turistas/${id}`, turistaDTO);
  }

  // Actualizar un proveedor
  actualizarProveedor(id: number, proveedorData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/proveedores/${id}`, proveedorData);
  }

  // Eliminar un usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  // Obtener estadísticas para el dashboard
  obtenerEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }
}
