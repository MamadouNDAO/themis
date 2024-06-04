import {Component, Injector, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {ModelHistoRiqueReservation, ModelHistory, ModelNotif, ModelRoom} from "../Model/ModelData";
import {FixtureService} from "../Model/fixture.service";
import {Sort} from "@angular/material/sort";
import {ApiService} from "../services/api.service";
import {Subscription} from "rxjs";
import * as moment from 'moment';
import {ActivatedRoute} from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";
import * as XLSX from "xlsx";

interface OneRoomModel{
  id: string,
  name: string,
  mapwizeId: string,
  etage: string,
  site: string
}
@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationComponent extends BasePage implements OnInit, OnDestroy{

  oneRoom!: OneRoomModel
  p: number = 1;
  total: number = 0
  isLoading: boolean = false
  nombrePage: number = 1
  itemParPage: number = 11
  reservations: ModelRoom[] = []
  roomAll: ModelRoom[] = []
  sortedData: ModelRoom[] = []
  filteredRoom: ModelRoom[] = []
  filteredRoomAll: ModelRoom[] = []
  isNotif: boolean = false
  isAutocomplete: boolean = false
  date: Date = new Date()
  heureDebut: number = 17
  minuteDebut: number = 0
  heureFin: number = 17
  minuteFin: number = 30
  isReservation: boolean = false
  selected = new Date()
  apiRoom!: Subscription
  emails: string[] = []
  participants: string[] = []
  suggestionEmails: string[] = []
  apiEmail!: Subscription
  apiSendReserv!: Subscription
  apiHistory!: Subscription
  nomSalles: string[] = []
  nomSallesAll: string[] = []
  suggestionSalle: string[] = []
  objet: string = ''
  nameRoom: string = ''
  isUpdate: boolean = false
  emailInvalides: string[] = []
  isHistory: boolean = false
  idReservation: any
  listAvenir: ModelHistoRiqueReservation[] = []
  sort: Sort = {
    active: '',
    direction: ''
  };
  isBtn: boolean = true
  isAvenir: boolean = true
  isDeleting: boolean = false
  histoEncours: ModelHistory[] = []
  histoTerminer: ModelHistory[] = []
  isInfoRoom: boolean = false
  isImmediat: boolean = false
  idReservToDelete: any
  isLoadingRoom: boolean = false
  isFiltering: boolean = false
  notifs: ModelNotif[] = []
  nbNotif: number = 0
  fileName= 'Reservation.xlsx';
  constructor(injector: Injector, private fixture: FixtureService, private api: ApiService, private route: ActivatedRoute) {
    super(injector);

  }

  ngOnInit(): void {
    this.getRooms()
    this.getInvites()
    this.gestionHour()
    this.getRoomsAll()
    const id = this.route.snapshot.queryParams['id'];
    if(id != undefined) {
      if(localStorage.getItem('RoomToReserve')){
        let data = localStorage.getItem('RoomToReserve')
        if(data){
          let room = JSON.parse(data)
          this.nameRoom = room.name
          this.isReservation = true
        }

      }

    }
    //this.reservations = this.fixture.reservations
    this.listAvenir = this.fixture.historiques
    this.getNombreNotif()
  }

  showInfo(room: ModelRoom){
    console.log("test")
    this.oneRoom = {
      id: room.id,
      name: room.name,
      mapwizeId: room.zone.mapwizeId,
      etage: room.floor.name,
      site: room.site
    }

    this.isInfoRoom = true
    console.log(this.isInfoRoom)
  }

  showImmediatReserv(room: ModelRoom ){
    this.oneRoom = {id: room.id, name: room.name, mapwizeId: room.zone.mapwizeId, etage: room.floor.name, site: room.site}
    this.isImmediat = true
  }

  closeImmediat(){
    this.isImmediat = false
  }


  closeInfo(){
    this.isInfoRoom = false
  }

  showDelete(item: ModelHistory){
    this.idReservToDelete = item.id
    this.isDeleting = true
  }
  closeDelete(){
    this.isDeleting = false
  }

  goToMap(room: ModelRoom){
    localStorage.setItem('roomid', room.zone.mapwizeId);
    window.location.replace('/cartographie')
  }
  goToMap2(room: ModelHistory){
    let theRoom = this.reservations.find((e) =>{
        return e.id == room.room.id
    }

    );

    if(theRoom){
      localStorage.setItem('roomid', theRoom.zone.mapwizeId);
      window.location.replace('/cartographie')
    }else{
      this.showError("La salle est introuvable")
    }

  }

  goToLocalise(room: OneRoomModel){
    localStorage.setItem('roomid', room.mapwizeId);
    window.location.replace('/cartographie')
  }

  getHistorique(){
    this.isLoadingRoom = true
    this.histoEncours = []
    this.histoTerminer = []
    this.apiHistory = this.api.getHistoriqueReservation().subscribe(
      resp => {
        let currentDate: Date = new Date();
        console.log(resp)

        this.histoTerminer = resp.map((r:ModelHistory) => {
          if(r.isCanceled || (this.convertToDate(r.dateEnd) < currentDate)){
            return r
          }else{
            this.histoEncours.push(r)
          }
          return
        })

        this.histoTerminer.sort((a, b) => b.id - a.id);
        this.isLoadingRoom = false
        //console.log(this.histoTerminer)
      },
      err => {
        this.isLoadingRoom = false
        this.showError("Une erreure est survenue lors du chargement !")
      }
    )
  }

  convertStringDateenDate(dateStr: string){
    const date = new Date(dateStr);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatter = new Intl.DateTimeFormat('fr-FR');

    return dateFormatter.format(date);
  }

  convertStringHour(dateStr: string){
    const date = new Date(dateStr);

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    let hourConvert
    if(hour < 10){
      hourConvert = '0'+hour
    }else{
      hourConvert = hour
    }
    let minuteConvert
    if(minute < 10){
      minuteConvert = '0'+minute
    }else{
      minuteConvert = minute
    }

    return `${hourConvert}h${minuteConvert}`
  }

  convertToDate(dateString: string): Date {
    return new Date(dateString);
  }

  changeTabs(tab:string){
    switch (tab){
      case 'avenir': this.isAvenir = true
        break;
      case 'termine': this.isAvenir = false
    }

  }

  showHistorique() {
    this.isHistory = !this.isHistory
    if(this.isHistory){
      this.getHistorique()
    }
  }

  addEmail(email: string, Invites: HTMLInputElement){
    if(this.participants.indexOf(email) == -1){
      this.participants.push(email);
    }
    Invites.value = ''
  }

  removeItem(i: number){
    this.participants.splice(i, 1)
  }


  changePage($event: number) {
    if(($event <= this.nombrePage) && ($event >= 1)) {
      this.p = $event
    }

  }

  selectItem(i: number) {
    this.reservations.map((n) => {
      n.selected = false
    })
    i = (this.itemParPage * (this.p - 1)) + i
    this.reservations[i].selected = true
  }

  showNotif() {
    this.notifs = this.getNotif('reservation')
    this.isNotif = !this.isNotif
    this.readNotif('reservation')
    this.getNombreNotif()
  }

  upHour(name: string) {

    if(name == 'debut') {
      if(this.heureDebut < 23){
       this.heureDebut++
      }
    }else{
      if(this.heureFin < 23){
        this.heureFin++
      }
    }
  }

  downHour(name: string) {

    if(name == 'debut') {
      if(this.heureDebut > 0){
        this.heureDebut--
      }
    }else{
      if(this.heureFin > 0){
        this.heureFin--
      }
    }
  }

  formatterItem(nombre:number) {
    if (nombre < 10) {
      return '0' + nombre;
    } else {
      return nombre.toString();
    }
  }

  upMinute(name: string) {

    if(name == 'debut') {
      if(this.minuteDebut < 59){
        this.minuteDebut += 15
        this.minuteDebut = this.minuteDebut >= 60 ? 0 : this.minuteDebut
      }
    }else{
      if(this.minuteFin < 59){
        this.minuteFin += 15
        this.minuteFin = this.minuteFin >= 60 ? 0 : this.minuteFin
      }
    }
  }

  downMinute(name: string) {

    if(name == 'debut') {
      if(this.minuteDebut > 0){
        this.minuteDebut -= 15
      }
    }else{
      if(this.minuteFin > 0){
        this.minuteFin -= 15
      }
    }
  }

  ouvreReservation() {
    this.isReservation = true
  }

  closeReservation() {
    this.isReservation= false
  }


  sortData(column: string) {
    if (this.sort.active === column) {
      this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort.active = column;
      this.sort.direction = 'asc';
    }
    const data = this.reservations.slice();
    if (!this.sort.active /*|| this.sort.direction === ''*/) {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'room':
          return this.compare(a.name, b.name, isAsc);
        case 'etage':
          return this.compare(a.floor.name, b.floor.name, isAsc);
        case 'site':
          return this.compare(a.site, b.site, isAsc);
        case 'capacite':
          return this.compare(a.zone.maximumCapacity, b.zone.maximumCapacity, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getRooms() {
    this.isLoadingRoom = true
    this.apiRoom = this.api.getSalles('&availableonly=yes').subscribe(
      resp => {
        this.reservations = resp
        this.sortedData = this.reservations.slice();
        this.total = this.reservations.length
        this.nombrePage = Math.ceil(this.total / this.itemParPage)

        this.nomSalles = this.reservations.map((r) => {
          return r.name
        })

        this.isLoadingRoom = false
      },
      error => {
        this.isLoadingRoom = false
        this.showError("Une erreure est survenue lors du chargement !")
      }
    )
  }

  getRoomsAll() {
    this.apiRoom = this.api.getSalles('&availableonly=no').subscribe(
      resp => {
        this.roomAll = resp

        this.nomSallesAll = this.roomAll.map((r) => {
          return r.name
        })
      }
    )
  }

  renameEtage(name: string){
    if(name !== "Mezzanine"){
     return name.replace(/[A-Za-z]$/, '')
    }
    return name
  }

  getInvites(){
    this.apiEmail = this.api.getUsers().subscribe(
      resp => {
        this.emails = resp.map((e: any) => {
          return e.email
        })
        //this.suggestionEmails = this.emails
      }
    )
  }


  filtreEmail(email: HTMLInputElement){
    if(email.value.toString().length > 2){
      this.suggestionEmails = this.emails.filter(e =>
        e.toLowerCase().includes(email.value.toString().toLowerCase())
      );
    }
  }

  filtreSalle(salle: HTMLInputElement){
    if(salle.value.toString().length > 2){
      this.suggestionSalle = this.nomSallesAll.filter(e =>
        e.toLowerCase().includes(salle.value.toString().toLowerCase())
      );
    }
  }

  gestionHour(){
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const now = new Date();
    const myminutes = now.getMinutes();
    const roundedMinutes = Math.ceil(myminutes / 15) * 15;
    now.setMinutes(roundedMinutes);

    const startHour = now.getHours();
    const startMinute = now.getMinutes();

    const endHour = (startHour + 1) % 24;
    const endMinute = startMinute;

    const startTime = new Date();
    startTime.setHours(startHour, startMinute);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute);

    this.heureDebut = startHour
    this.minuteDebut = startMinute
    this.heureFin = endHour
    this.minuteFin = endMinute
    //this.heureDebut = startTime.toLocaleTimeString('fr-FR', { timeZone: userTimeZone, hour12: false, hour: '2-digit', minute: '2-digit' });
    //this.heureFin = endTime.toLocaleTimeString('fr-FR', { timeZone: userTimeZone, hour12: false, hour: '2-digit', minute: '2-digit' });

  }

  makeReservation(){
    this.isBtn = false
    let date = this.formatDate(this.selected)
    let debut = date+'T'+this.formatterItem(this.heureDebut)+':'+this.formatterItem(this.minuteDebut)+':00'+moment().format('Z')
    let fin = date+'T'+this.formatterItem(this.heureFin)+':'+this.formatterItem(this.minuteFin)+':00'+moment().format('Z')

    let emailString = ""
    if(this.participants.length > 1){
      emailString = this.participants.join(',');
    }else{
      emailString = this.participants.length == 1 ? this.participants[0] : ""
    }
    let data = {
      start: debut,
      end: fin,
      subject: this.objet,
      invites: emailString,
      token: localStorage.getItem("userToken")
    }

    let Salle = this.reservations.find((r) => {
      return r.name == this.nameRoom
    })
    if(Salle){
      if(!this.isUpdate){
        this.apiSendReserv = this.api.sendReservation(data, Salle.id).subscribe(
          resp => {
            this.isBtn = true
            this.objet = ''
            this.nameRoom = ''
            this.participants = []
            this.showSuccess("Réservation réalisée avec succès!")
            this.isReservation = false
          },
          error => {
            this.isBtn = true
            if(error.status == 408){
              this.showError("La salle est déjà réservée dans ce créneau horaire!")
            }else if(error.status == 200){
              this.emailInvalides = error.error.text.split(',');
            }
          }
        )
      }

    }else{
      this.isBtn = false
      this.api.updateReservation(data, this.idReservation).subscribe(
        resp => {
          this.isBtn = true
          this.isReservation = false
          this.participants = []

          this.objet = ''
          this.showSuccess("Réservation modifiée avec succès!")
          this.getHistorique()
        },
        error => {
          this.isBtn = true
          if(error.status == 408) {
            this.showError("La salle est déjà réservée dans ce créneau horaire!")
          }else {
            this.showError("La modification a échoué!")
          }
          this.participants = []
          this.isReservation = false
          this.objet = ''
        }
      )

    }


  }

  makeSuppression() {
    this.isDeleting = false
    this.isLoading = true
    this.api.libererSalle(this.idReservToDelete).subscribe(
      resp => {
        this.showSuccess("La réservation est supprimée avec succès!")
        this.isLoading = false
        this.getHistorique()

      }
    )
  }

  makeUpdateReservation(Reservation: any) {

    let debut = new Date(Reservation.dateStart.toString())
    this.selected = new Date(Reservation.dateStart.toString())

    this.heureDebut = debut.getHours();
    this.minuteDebut = debut.getMinutes();

    let fin = new Date(Reservation.dateEnd.toString())
    this.heureFin = fin.getHours();
    this.minuteFin = fin.getMinutes();



    this.objet = Reservation.subject
    this.participants = Reservation.invites ? Reservation.invites.split(",") : [] ;
    this.nameRoom = Reservation.room.name
    this.isUpdate = true
    this.idReservation = Reservation.id
    this.isReservation = true

  }

  reservationImmediat(){
    this.isImmediat = false
    this.isInfoRoom = false
    this.isLoading = true
    this.gestionHour()
    let date = this.formatDate(this.selected)
    let debut = date+'T'+this.formatterItem(this.heureDebut)+':'+this.formatterItem(this.minuteDebut)+':00'+moment().format('Z')
    let fin = date+'T'+this.formatterItem(this.heureFin)+':'+this.formatterItem(this.minuteFin)+':00'+moment().format('Z')


    let data = {
      start: debut,
      end: fin,
      subject: "Réservation",
      invites: "",
      token: localStorage.getItem("userToken")
    }


        this.apiSendReserv = this.api.sendReservation(data, this.oneRoom.id).subscribe(
          resp => {
            this.isBtn = true
            this.objet = ''
            this.nameRoom = ''
            this.participants = []
            this.showSuccess("Réservation réalisée avec succès!")
            this.isReservation = false
            this.getRooms()
            this.isLoading = false
          },
          error => {
            this.isLoading = false
            if(error.status == 408){
              this.showError("La salle est déjà réservée dans ce créneau horaire!")
            }else if(error.status == 200){
              this.emailInvalides = error.error.text.split(',');
            }
          }
        )

  }

  formatDate(date: Date){
    var dateOriginale = new Date(date);

    var annee = dateOriginale.getUTCFullYear();
    var mois = (dateOriginale.getUTCMonth() + 1).toString().padStart(2, '0');
    var jour = dateOriginale.getUTCDate().toString().padStart(2, '0');

    return annee + "-" + mois + "-" + jour
  }

  showSuccess(msg: string) {
    this.showToast(true, false, msg)
    this.setNotif('reservation', msg)
    this.getNombreNotif()
  }

  showError(msg: string) {
    this.showToast(false, true, msg)
  }

  searchSalle(salle: HTMLInputElement){
    this.isFiltering = salle.value.length > 0

    this.filteredRoom = this.sortedData.filter(e =>
      e.name.toLowerCase().includes(salle.value.toString().toLowerCase())
    );
  }

  getNombreNotif(){
    this.nbNotif = this.getNbNotif('reservation')
  }

  ngOnDestroy(): void {
    if(this.apiRoom) {this.apiRoom.unsubscribe()}
    if(this.apiEmail) {this.apiEmail.unsubscribe()}
    if(this.apiSendReserv) {this.apiSendReserv.unsubscribe()}
  }

  exportexcel(): void
  {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
    this.showSuccess("Réservation exportée avec succès !")
  }
}
