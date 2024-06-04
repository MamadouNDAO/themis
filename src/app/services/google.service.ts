import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(private http: HttpClient) { }

  getDestination(input: string) {
    return this.http.get('https://api-themis.cloud.iviflo.com/api/v1/transport/google/autocompletion/'+input);
  }
}
