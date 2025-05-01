import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../../../servicios/services/servicio.service';

@Component({
  selector: 'app-info-servicio',
  imports: [],
  templateUrl: './info-servicio.component.html',
  styleUrl: './info-servicio.component.css'
})
export class InfoServicioComponent {

  servicio: any;

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
