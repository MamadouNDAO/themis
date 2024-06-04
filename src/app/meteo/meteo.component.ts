import {Component, Injector, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {MainDetail, ModelMeteo, WeatherDetail, WeatherModel, WindDetail} from "../Model/ModelData";
import {FixtureService} from "../Model/fixture.service";
import {GoogleService} from "../services/google.service";
import {MeteoService} from "./meteo.service";

interface ModelVille{
  place_id: string,
  description: string,
  structured_formatting: any
}

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.scss']
})
export class MeteoComponent extends BasePage implements OnInit{
  meteos: WeatherModel[] = []
  meteoClichy!: WeatherModel
  isSearch: boolean = false
  ville: string = ''
  input: any
  GoogleArray: any
  baseUrl = "assets/icon/meteo/"
  listeVilles = [
    "Paris, France", "Aeroport de Paris-Charles de Gaulle (CDG), Roissy-en-France, France", "Pari Chowk, NRI City, Omega II, Noida, Uttar Pradesh, Inde", "Paris, Texas, Etats-Unis",
    "Paris, Comte de Brant, ON, Canada", "Caen, France", "Lyon, France", "Madrid, Espagne"
  ]

  suggestionVilles: ModelVille[] = []
  private autoCompletepredictions: any;
  constructor(injector: Injector, private fixture: FixtureService, private google: GoogleService, private meteoService: MeteoService) {
    super(injector);
  }

  ngOnInit(): void {
    //this.meteos = this.fixture.meteos
    this.DefaultWeather()
    if(localStorage.getItem("citys")){
      let datas: any = localStorage.getItem("citys")
      this.meteos = JSON.parse(datas)
      this.meteos = this.supprimerDoublonsParNom(this.meteos)
      this.meteos.sort((a, b) => a.position - b.position);
    }
  }


  getIconFavoris(favoris: boolean){
    let icon = ''
    if(favoris){
      switch (this.theme.color){
        case 'sci-color': icon = 'favoris-sci-actif'
          break;
        case 'pmu-color': icon = 'favoris-pmu-actif'
          break
      }
    }else{
      icon = 'favoris-inactif'
    }

    return icon+'.png'
  }


  closeSearch(item: ModelVille) {
    this.isSearch = false
    this.suggestionVilles = []
    this.ville = item.description
    console.log(item.structured_formatting.main_text)
    this.getCity(item.structured_formatting.main_text)
  }

  getCity(city: string) {
    if (city!== '') {
      this.meteoService.getWeatherDataByCityName(city).subscribe(data => {
        let w:any = data
        let v: WeatherModel = {name: w.name,timezone: w.timezone,weather: w.weather,main: w.main,wind: w.wind, favoris: false, position: 2}
        this.addCity(v);
        this.input= ""
      },)
    }
  }

  addCity(city: WeatherModel) {
    if(city.name != 'Clichy'){
      this.meteos.push(city);
      this.meteos = this.supprimerDoublonsParNom(this.meteos)
      localStorage.setItem("citys", JSON.stringify(this.meteos))
    }
  }

  supprimerDoublonsParNom(tableau: WeatherModel[]) {
    const nomsUniques = new Set();
    return tableau.filter((objet) => {
      if (!nomsUniques.has(objet.name)) {
        nomsUniques.add(objet.name);
        return true;
      }
      return false;
    });
  }

  getTimeHoraire(timezone: any) {
      const currentDate = new Date();
      const utcOffsetMilliseconds = currentDate.getTimezoneOffset() * 60 * 1000;
      const dateUtc = new Date(currentDate.getTime() + utcOffsetMilliseconds)
      return  new Date(dateUtc.getTime() + timezone * 1000);
  }

  deleteInputSearch() {
    this.ville = ''
  }

  myAutoMapComplete(event: HTMLInputElement) {
    this.input = event.value;
    if(this.input.length > 2) {
      this.isSearch = true;
      this.GoogleArray = this.google.getDestination(this.input).subscribe(
        response => {
          let data: any = response
            if (data['status'] === 'OK') {
              this.suggestionVilles= data['predictions'];
            }

        });
    }else{
      this.isSearch = false;
    }
  }

  DefaultWeather() {
    this.meteoService.defaultWeather().subscribe(data => {
      let w:any = data
      this.meteoClichy = {name: w.name,timezone: w.timezone,weather: w.weather,main: w.main,wind: w.wind, favoris: true, position: 1}
      //this.meteos.push(clichy)
      //this.meteos = this.supprimerDoublonsParNom(this.meteos)
    });
  }

  getIcon(description: string): string {
    let icon: string;

    switch (description) {
      case 'overcast clouds':
        icon = "nuage";
        break;
      case 'clear sky':
        icon = "soleil";
        break;
      case 'few clouds':
        icon = "nuage";
        break;
      case 'broken clouds':
        icon = "nuage";
        break;
      case 'shower rain':
        icon = "pluie";
        break;
      case 'rain':
        icon = "pluie";
        break;
      case 'thunderstorm':
        icon = "pluie";
        break;
      case 'snow':
        icon = "nuage-soleil";
        break;
      case 'mist':
        icon = "nuage";
        break;
      default:
        icon = "nuage-soleil";
    }
    return icon;
  }

  addToFavoris(i: number){
    if(this.meteos[i].name !== 'Clichy'){
      this.meteos[i].favoris = !this.meteos[i].favoris
      this.meteos[i].position = this.meteos[i].favoris ? 1 : 2
      this.meteos.sort((a, b) => a.position - b.position);
      localStorage.setItem("citys", JSON.stringify(this.meteos))


    }

  }

  removeMeteos(i: number){
    if(this.meteos[i].name !== 'Clichy'){
      this.meteos.splice(i, 1)
      localStorage.setItem("citys", JSON.stringify(this.meteos))
    }
  }

  protected readonly setInterval = setInterval;
}
