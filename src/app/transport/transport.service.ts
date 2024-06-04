import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  urlApi = 'https://api.navitia.io/v1/journeys?';
  key = '5f67dc75-7cc8-44ca-86ba-7f0f3b1d5ca2:';
  googleUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
  googleKey = 'AIzaSyB8EAwtn4Xo1mWWyQmmlPyOYvHre6NeRgE'

  coords = [];
  url: any;
  constructor(private http: HttpClient) { }

  changeCoordinate(input: any){
    return this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q='${input} france`)
  }

  getDestination(input:any, lat:any, long:any) {
    console.log('my input:', input, 'my latitude:', lat, 'my longitude:', long );
    return this.http.get(this.googleUrl+'input='+input+'&'+'types=establishment|geocode&location:'+lat+','+long+'@&radius=500&language=en&key='+this.googleKey);
  }

  getData(lat:any, long:any, coordinates:any) {
    const maxDuration = 2000000;
    this.url = this.urlApi+`from=${long};${lat}&to=${coordinates.lng};${coordinates.lat}`+'&max_duration='+maxDuration;
    return this.http.get(this.url, {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(this.key),
      }),
      responseType: 'json',
    });
  }
}
