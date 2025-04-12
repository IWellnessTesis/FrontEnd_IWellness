import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header-turista',
  imports: [],
  templateUrl: './header-turista.component.html',
  styleUrl: './header-turista.component.css'
})
export class HeaderTuristaComponent {

  usuario: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.usuarioHome().subscribe({
      next: (data) => {
        this.usuario = data;
        this.usuario = JSON.parse(data);
        console.log(this.usuario)
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      }
    });
  }

  navigateTo(path: string,id?: any) {
    this.router.navigate([path, id]);
  } 

}
