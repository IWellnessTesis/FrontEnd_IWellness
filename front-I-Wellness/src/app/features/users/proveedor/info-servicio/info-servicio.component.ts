import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../../../servicios/services/servicio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-servicio',
  imports: [CommonModule],
  templateUrl: './info-servicio.component.html',
  styleUrl: './info-servicio.component.css'
})
export class InfoServicioComponent {

  servicio: any;

  reviews = [
    { name: 'Laura G.', comment: 'Excelente servicio, muy profesional.', rating: 5 },
    { name: 'Carlos M.', comment: 'Todo fue muy puntual y agradable.', rating: 4 },
    { name: 'Ana P.', comment: 'Me encantó, repetiría sin dudar.', rating: 5 },
  ];
  
  averageRating = 4.7;

  constructor(private route: ActivatedRoute, private servicioService: ServicioService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      const id = Number(params.get('id'));
      this.servicioService.buscarPorId(id).subscribe({
        next: data => {
          this.servicio = data;
          console.log(this.servicio);
        }
      })
    })
  }
  

}
