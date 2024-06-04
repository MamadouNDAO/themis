import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CreateUser} from "../Model/ModelData";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apisHost = "https://api-themis.cloud.iviflo.com/api/v1"

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any>{
    return this.http.post(this.apisHost+'/security/login', data)
  }

  getUrlSSO(data: any) : Observable<string> {
    return this.http.post(this.apisHost+'/anonym/organization/getsso', data, { responseType: 'text' })
  }

  infoUser(tokenId: string): Observable<any> {
    return this.http.get(this.apisHost+'/security/token/'+tokenId)
  }

  getActualite(): Observable<any> {
    return this.http.get(this.apisHost+'/news/posts?range=0-30')
  }

  setComment(data: any) : Observable<any> {
    return this.http.post(this.apisHost+'/news/comments/', data)
  }

  setFavoris(idPost: any) : Observable<any> {
    return this.http.post(this.apisHost+'/news/posts/'+idPost+'/favorite', '')
  }

  setLike(idPost: any) : Observable<any> {
    return this.http.post(this.apisHost+'/news/posts/'+idPost+'/like', '')
  }

  getSalles(filtre: string): Observable<any> {
    return this.http.get(this.apisHost+'/room?select=reservationStatus'+filtre)
  }

  getUsers() : Observable<any> {
    return this.http.get(this.apisHost+'/user/')
  }

  sendReservation(data: any, idRoom: string): Observable<any> {
    return this.http.post(this.apisHost+'/room/'+idRoom+'/reservation', data)
  }

  getHistoriqueReservation(): Observable<any> {
    return this.http.get(this.apisHost+'/reservation/user')
  }

  getSallesObscure() : Observable<any> {
    return this.http.get(this.apisHost+'/room/norooms')
  }

  getSallesConstat() : Observable<any> {
    return this.http.get(this.apisHost+'/room/')
  }

  updateReservation(data: any, idReservation: number): Observable<any> {
    return this.http.post(this.apisHost+'/room/reservation/'+idReservation, data)
  }

  sendConstat(data: any, idSalle: any): Observable<any> {
    return this.http.post(this.apisHost+'/room/'+idSalle+'/statement', data)
  }

  libererSalle(idR: number) : Observable<any> {
    return this.http.delete(this.apisHost+'/reservation/'+idR)
  }


  getCategories() :Observable<any> {
    return this.http.get(this.apisHost+'/category_ticket')
  }

  inscription(data: CreateUser): Observable<any>{
    return this.http.post(this.apisHost+'/user/register/mobile/', data)
  }

  getHistoryConstat(iduser: any) : Observable<any> {
    return this.http.get(this.apisHost+'/ticket?opener='+iduser)
  }

  listService(): Observable<any> {
    return this.http.get(this.apisHost+'/service')
  }

  getPriorite(): Observable<any> {
    return this.http.get(this.apisHost+'/ticket/priority/liste')
  }

  editUser(data: any, idUser: string): Observable<any>{
    return this.http.post(this.apisHost+'/user/profile/'+idUser, data)
  }

  resetPassword(data: any): Observable<any>{
    return this.http.post(this.apisHost+'/security/reset/password', data)
  }

  desinscription(): Observable<any>{
    return this.http.post(this.apisHost+'/user/unsubscribe', null)
  }

}
