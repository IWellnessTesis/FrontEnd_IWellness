import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import countriesData from '../../../../assets/countries+cities.json';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    ngOnInit() {
      this.countries = this.countriesData.map(country => country.name);
    }
  
    onCountryChange() {
      const country = this.countriesData.find(c => c.name === this.selectedCountry);
      this.cities = country ? country.cities : [];
    }

   constructor(private router: Router) {}
        navigateTo(path: string) {
          this.router.navigate([path]);
        }

}
