import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar',
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css',
})
export class RecuperarComponent {
  correo: string = '';
  emailError: string = '';

  validateEmail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.correo.match(regex)) {
      this.emailError = 'Ingrese un correo electrónico válido';
      return false;
    } else {
      this.emailError = '';
      return true;
    }
  }

  onSubmit() {
    if (!this.correo) {
      this.emailError = 'Por favor ingrese un correo electrónico';
      return;
    }

    if (this.validateEmail()) {
      Swal.fire({
        icon: 'success',
        title: 'Perfecto',
        text: 'Hemos enviado un correo de recuperación a tu correo electrónico',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4a9c9f',
      });
    }
  }
}
