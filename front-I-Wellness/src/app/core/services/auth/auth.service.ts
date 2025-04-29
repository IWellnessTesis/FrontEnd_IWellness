import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/auth'; // URL completa al backend
  
  constructor(private http: HttpClient) { }

  // Método para el login
  login(correo: string, contraseña: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    const body = {
      correo: correo,
      contraseña: contraseña
    };
  
    return this.http.post(`${this.apiUrl}/login`, body, {
      headers,
      responseType: 'text' // JWT en texto plano
    }).pipe(
      tap((token: string) => {
        if (token) {
          localStorage.setItem('token', token);
        }
      }),
      switchMap((token: string) => {
        // Una vez que tenemos el token, obtenemos el rol del usuario
        return this.getUsuarioActual().pipe(
          map((rol: string) => {
            // Guardamos el rol
            localStorage.setItem('rol', rol);
            
            // Devolvemos un objeto con el token y el rol
            return { token, rol };
          })
        );
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error(error.error || 'Error en el inicio de sesión'));
      })
    );
  }

 

  getUsuarioActual(): Observable<string> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}/role`, {
      headers,
      responseType: 'text' // evitar el error de JSON.parse
    }).pipe(
      catchError(error => {
        console.error('Error al obtener usuario actual:', error);
        return throwError(() => new Error(error.error || 'Error al obtener usuario'));
      })
    );
  }

  usuarioHome(): Observable<string> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}/info`, {
      headers,
      responseType: 'text' // evitar el error de JSON.parse
    }).pipe(
      catchError(error => {
        console.error('Error al obtener usuario actual:', error);
        return throwError(() => new Error(error.error || 'Error al obtener usuario'));
      })
    );
  }
  

  // Método para registrar turista y manejar login automático
registerTurista(turistaData: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  const body = {
    nombre: turistaData.nombre,
    correo: turistaData.correo,
    contraseña: turistaData.contraseña,
    telefono: turistaData.telefono,
    ciudad: turistaData.ciudad,
    pais: turistaData.pais
  };

  // Guardar las credenciales para posible autologin
  localStorage.setItem('registeredEmail', turistaData.correo);
  localStorage.setItem('tempPassword', turistaData.contraseña);

  return this.http.post<any>(`${this.apiUrl}/registro/Turista`, body, { 
    headers,
    responseType: 'text' as 'json'
  }).pipe(
    map(response => {
      console.log('Respuesta de registro:', response);
      
      return { 
        success: true, 
        message: response
      };
    }),
    catchError(error => {
      console.error('Error en registro de turista:', error);
      return throwError(() => new Error(error.error || 'Error en el registro de turista'));
    })
  );
}

// Método similar para proveedores
registerProveedor(proveedorData: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  const body = {
    nombre: proveedorData.nombre,
    correo: proveedorData.correo,
    contraseña: proveedorData.contraseña,
    nombre_empresa: proveedorData.nombre_empresa,
    coordenadaX: proveedorData.coordenadaX,
    coordenadaY: proveedorData.coordenadaY,
    cargoContacto: proveedorData.cargoContacto,
    telefono: proveedorData.telefono,
    telefonoEmpresa: proveedorData.telefonoEmpresa
  };

  // Guardar las credenciales para posible autologin
  localStorage.setItem('registeredEmail', proveedorData.correo);
  localStorage.setItem('tempPassword', proveedorData.contraseña);

  return this.http.post<any>(`${this.apiUrl}/registro/Proveedor`, body, { 
    headers,
    responseType: 'text' as 'json'
  }).pipe(
    map(response => {
      console.log('Respuesta de registro:', response);
      
      return { 
        success: true, 
        message: response 
      };
    }),
    catchError(error => {
      console.error('Error en registro de Proveedor:', error);
      return throwError(() => new Error(error.error || 'Error en el registro de Proveedor'));
    })
  );
}
  
  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener el usuario actual
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}