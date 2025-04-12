import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import countriesData from '../../../../../assets/countries+cities.json';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-perfil-turista',
  standalone: true, // Como es standalone, hay que importar FormsModule aquí
  imports: [CommonModule, FormsModule], 
  templateUrl: './perfil-turista.component.html',
  styleUrl: './perfil-turista.component.css'
})
export class PerfilTuristaComponent implements OnInit {

  countriesData: any[] = countriesData; // Cargamos los datos directamente
  countries: string[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';
  usuario: any;

  constructor(private route: ActivatedRoute, private router: Router, private usuarioServicio: UsuarioService) {}

  ngOnInit() {
      this.countries = this.countriesData.map(country => country.name);
      
      this.route.paramMap.subscribe(params => {
        const id = Number(params.get('id'));
        this.usuarioServicio.obtenerPorId(id).subscribe({
          next: data => {
            this.usuario = data;
            console.log("original:",this.usuario)
            
          this.selectedCountry = this.usuario.turistaInfo?.pais;
          this.onCountryChange(); 
          this.selectedCity = this.usuario.turistaInfo?.ciudad;
          }
      });
    });
  }
  
  onCountryChange() {
    const country = this.countriesData.find(c => c.name === this.selectedCountry);
    this.cities = country ? country.cities : [];
  }
  
  navigateTo(path: string) {
    
  }

  guardarCambios() {

  }

}
