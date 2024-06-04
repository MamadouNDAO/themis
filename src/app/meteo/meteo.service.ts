import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MeteoService {
  url ='https://api.openweathermap.org/data/2.5/weather?&units=metric&lang=fr';
  apiKey= '3c6d3826d4a217da0f05730829c10e12';

  constructor(private http:HttpClient) { }


  getWeatherDataByCoords(lat:number,lon: number){
    let params = new HttpParams()
      .set('lat',lat)
      .set('lon',lon)
      .set('units','imperial')
      .set('appid',this.apiKey)
    return this.http.get(this.url,{ params })
  }
  getWeatherDataByCityName(city:string){
    let params = new HttpParams()
      .set('q',city)
      .set('units','imperial')
      .set('appid',this.apiKey)
    return this.http.get(this.url,{ params })
  }
  defaultWeather(){
    let params = new HttpParams()
      .set('q','clichy')
      .set('units','imperial')
      .set('appid',this.apiKey)
    return this.http.get(this.url,{ params })
  }


}
