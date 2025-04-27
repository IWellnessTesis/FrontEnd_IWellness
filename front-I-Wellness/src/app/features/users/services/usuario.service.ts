import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usuarios } from '../../../shared/models/usuarios';
import { catchError, Observable, throwError } from 'rxjs';

const API_URL = 'http://localhost:8082/usuarios';  

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<any> {
    return this.http.get(`${API_URL}/all`);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get(`${API_URL}/buscar/${id}`);
  }

 editarUsuario(id: number, datos: any): Observable<any> {
    console.log('en el servicio front Datos a editar:', datos);
    console.log('ID del usuario a editar:', id);
    return this.http.put(`${API_URL}/editar/${id}`, datos);
  }
  actualizarUsuario(id: number, datos: any): Observable<any> {
    return this.http.put(`${API_URL}/editar/${id}`, datos);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/eliminar/${id}`);
  }

  obtenerProveedores(): Observable<any> {
    console.log('obteniendo proveedores desde el servicio');
    return this.http.get(`${API_URL}/proveedores`);
  }

  obtenerTuristas(): Observable<any> {
    return this.http.get(`${API_URL}/turistas`);
  }

  obtenerPorCorreo(correo: string): Observable<any> {
    return this.http.get(`${API_URL}/obtenerPorCorreo/${correo}`);
  }
}

