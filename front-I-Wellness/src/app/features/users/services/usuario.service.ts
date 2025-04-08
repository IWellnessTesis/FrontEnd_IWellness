import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usuarios } from '../../../shared/models/usuarios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8082/usuarios';  

  constructor(private http: HttpClient) { }

  usuarioHome(): Observable<any>{
    return this.http.get<any>("/info");
  }
}

