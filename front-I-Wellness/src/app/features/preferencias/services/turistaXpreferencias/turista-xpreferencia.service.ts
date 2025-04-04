import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TuristaXPreferenciaService {
  private apiUrl = 'http://localhost:8081/api/turistaXPreferencia';

  constructor(private http: HttpClient) { }

  // Obtener todos los registros de turistaXPreferencia
  obtenerTodos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }

  // Crear una nueva relación de Turista X Preferencia
  crear(turistaXPreferencia: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear`, turistaXPreferencia);
  }

  // Actualizar una relación de Turista X Preferencia
  actualizar(turistaXPreferencia: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/editar`, turistaXPreferencia);
  }

  // Eliminar una relación de Turista X Preferencia
  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  // Obtener las relaciones por ID de turista
  obtenerPorTurista(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/turista/${idUsuario}`);
  }

  // Obtener las relaciones por ID de preferencia
  obtenerPorPreferencia(idPreferencia: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/preferencia/${idPreferencia}`);
  }

  // Eliminar todas las relaciones por ID de turista
  eliminarPreferenciasPorTurista(idTurista: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminarPorTurista/${idTurista}`);
  }
}
