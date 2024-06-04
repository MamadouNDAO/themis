import { Injectable } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    if (authReq.url.includes('https://api-themis.cloud.iviflo.com/api/v1/anonym/organization/getsso')||
      authReq.url.includes('https://api.navitia.io/v1/journeys') || authReq.url.includes('https://maps.googleapis.com')
      || authReq.url.includes('https://nominatim.openstreetmap.org') || authReq.url.includes('https://api.openweathermap.org/data') || authReq.url.includes('https://preprod.bo-technatt.com/') ) {
      return next.handle(authReq);
    }

    const token = localStorage.getItem("userToken");

    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
          .set('Accept', 'application/json')
         //.set('Content-Type', 'multipart/form-data')
      });

     /* if(authReq.url.includes('/statement')){
        authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token).set('Content-Type', 'multipart/form-data')})
      }*/
    }

    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
];
