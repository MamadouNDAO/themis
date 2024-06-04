import {AfterViewInit, Component, Injector, NgZone, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {FixtureService} from "../Model/fixture.service";
import {ModelHistoTransport, ModelTransport, WeatherModel} from "../Model/ModelData";
import {TransportService} from "./transport.service";
import {GoogleService} from "../services/google.service";
import {Subscription} from "rxjs";
import * as XLSX from 'xlsx';
// @ts-ignore
import TravelMode = google.maps.TravelMode;


declare var google: any;

interface ModelVille{
  place_id: string,
  description: string,
  structured_formatting: any
}

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent extends BasePage implements OnInit, AfterViewInit {
  long!: number //= 2.308617
  lat!: number //= 48.895686
  mylat: any;
  mylong: any;
  transports: ModelTransport[] = []
  histos: ModelHistoTransport[] = []
  isTransport:boolean = false
  isSearch: boolean = false
  isSearch2: boolean = false
  ville: string = ''
  ville2: string = ''
  input: any
  TransportArray: any = [];
  isHistory: boolean =false
  currentTraject: any;
  description: string =''
  cityDestination: string = '';
  suggestionVilles: ModelVille[] = []
  autoCompletepredictions: any[] = [];
  GoogleArray!: Subscription;
  distance: string = '';
  duration: string = '';
  completion!: ModelVille
  completion2!: ModelVille
  travelModes = [
    TravelMode.DRIVING,
    TravelMode.WALKING,
    TravelMode.BICYCLING,
    TravelMode.TRANSIT,
  ];
  depart: string = ''
  fileName= 'ExcelSheet.xlsx';
  allDirections: google.maps.DirectionsResult[] = [];
  p: number = 1;
  total: number = 0
  nombrePage: number = 1
  itemParPage: number = 11
  center: any;
  isInput1: boolean = true
  isPopupChoose: boolean = false
  urlTransp = this.theme.color == 'pmu-color' ? 'assets/icon/transport/pmu/' : 'assets/icon/transport/sci/'
  constructor(injector: Injector, private fixture: FixtureService,
              private transportService: TransportService, private google: GoogleService, private ngZone: NgZone) {
    super(injector);
  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.createMap(this.lat, this.long)

    }, 1500)
  }


  ngOnInit(): void {



    let datas = localStorage.getItem('historiqueTransport')
    if(datas){
      this.histos = JSON.parse(datas)
      this.total = this.histos.length
      this.histos.sort()
    }
    this.getPosition()
  }

  closePopup(){
    this.isPopupChoose = false
  }

  getPosition() {
    this.center = {lat: this.lat, lng: this.long};
    /*if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((resp) =>{
        this.lat = resp.coords.latitude;
        this.long =  resp.coords.longitude;

        if(this.lat == null){
          this.long = 2.308617
          this.lat = 48.895686
        }
        this.center = {lat: this.lat, lng: this.long};
        this.createMap(this.lat, this.long)
      });
    }else{
      this.long = 2.308617
      this.lat = 48.895686
    }*/
    this.long = 2.308617
    this.lat = 48.895686
  }

  createMap(lt: number, lg: number) {
    const mapOptions = {
      zoom: 14,
      center: { lat: lt, lng: lg }
    };

    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
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


  deleteInputSearch() {
    this.getPosition()
    this.ville = ''
    this.transports =  []
    this.isTransport = false
    setTimeout(() => {
      this.createMap(this.lat, this.long)
    }, 1500)
  }

  navitiaApi() {
    const destinationCoords = {lat: this.mylat, lng: this.mylong};
    this.TransportArray = this.transportService.getData(this.lat, this.long, destinationCoords);

    if (this.TransportArray) {
      this.TransportArray.subscribe(
        (arg: any ) => {
          this.currentTraject = arg.journeys[0];
        });
    }
  }

  myAutoMapComplete(event: HTMLInputElement, opt: string) {
    this.input = event.value;
    if(this.input.length > 2) {
      this.isSearch = opt == 'input1';
      this.isSearch2 = opt == 'input2';
      this.GoogleArray = this.google.getDestination(this.input).subscribe(
        response => {
          let data: any = response
          if (data['status'] === 'OK') {
            this.suggestionVilles= data['predictions'];
          }

        });
    }else{
      this.isSearch = false
      this.isSearch2 = false
    }
  }

  chooseSearch(item: ModelVille) {
    this.isSearch = false
    this.suggestionVilles = []
    this.ville = item.description
    this.completion = item
    this.getLatLong(this.completion, 'desti')
    setTimeout(() => {
      this.createMap(this.mylat, this.mylong)
    }, 1000)
  }

  chooseSearch2(item: ModelVille) {
    this.isSearch2 = false
    this.suggestionVilles = []
    this.ville2 = item.description
    this.completion2 = item
    this.reservDescript2()
    this.isInput1 = true
    this.depart = this.ville2
  }

  showPopupChoose(){
    if(this.ville != ''){
      this.isPopupChoose = true
    }else{
      this.showToast(false, true, "Veuillez choisir une destination !")
    }

  }

  showInput2(){
    this.isInput1 = false
    this.isPopupChoose = false
  }

  reservDescript2() {
    if(this.completion2 !== null){
      this.description = this.completion2.description;
      //this.input = this.description;
      this.ville2 = this.description;
      this.getLatLong(this.completion2, 'depart')
      setTimeout(() => {
        this.reservDescript()
      }, 1000)

    }
  }

  getLatLong(comp: ModelVille, typ: string){
    let geocoder = new google.maps.Geocoder();
    // @ts-ignore
    geocoder.geocode({ placeId: comp.place_id }).then(({results}) => {
      switch (typ){
        case 'depart':
          this.lat = results[0].geometry.location.lat();
          this.long = results[0].geometry.location.lng();
          break;
        case 'desti':
          this.mylat = results[0].geometry.location.lat();
          this.mylong = results[0].geometry.location.lng();
      }

      return true;
    }).catch((e: string) => {
        window.alert('Geocoder failed due to: ' + e);
        return false;
      }
    );
  }

  reservDescript() {
    this.isPopupChoose = false
    if(this.completion !== null){
      this.description = this.completion.description;
      this.cityDestination = this.completion.description;
      this.input = this.description;
      this.ville = this.description;
      this.isSearch = false;
      //this.getLatLong()
      setTimeout(() => {
       // this.navitiaApi();
      }, 1500)

      this.initialize('DRIVING');

      setTimeout(() => {
        this.hydrator()
        this.isTransport = true
      }, 3000)


    }
  }



  initialize(travelmode= 'DRIVING') {
    const mapOptions = {
      zoom: 12,
      center: { lat: this.lat, lng: this.long }
    };

    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer({map});

    let promises = this.travelModes.map(travelMode => {
      return directionsService.route({
        origin: new google.maps.LatLng(this.lat, this.long),
        destination: this.cityDestination,
        travelMode
      })
    });

    Promise.all([
      promises[0].catch((_: any) => null),
      promises[1].catch((_: any) => null),
      promises[2].catch((_: any) => null),
    ]).then(results => {
      this.allDirections = results;
      //console.log(JSON.stringify(this.allDirections[0].routes[0].legs[0].start_address))
      this.depart = JSON.stringify(this.allDirections[0].routes[0].legs[0].start_address)
    }).catch(error => alert('Une erreur est survenue'));
    directionsService.route({
      origin: new google.maps.LatLng(this.lat, this.long),
      destination: this.cityDestination,
      travelMode: google.maps.TravelMode.WALKING
    }, (response: any, status: any) => {

      this.duration = response.routes[0].legs[0].duration.text;
      this.distance = response.routes[0].legs[0].distance.text;
     // this.isDuration = true;

      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        console.error('Directions request failed due to ' + status);
      }

    })

  }

  getDirectionByTravelMode(mode: TravelMode) {

    return this.allDirections.find(direction => direction.routes[0]?.legs[0].steps[0].travel_mode == mode.valueOf());
  }

  getDuration(mode: TravelMode): string {
    const direction = this.getDirectionByTravelMode(mode);
    return direction ? direction.routes[0].legs[0].duration.text: 'Aucune données';
  }
  getDistance(mode: TravelMode): string {
    const direction = this.getDirectionByTravelMode(mode);
    return direction ? direction.routes[0].legs[0].distance.text: 'Aucune données';
  }



  hydrator() {

    this.travelModes.map((m) => {
      let icon = ''
      let typeMode = ''
      switch (m){
        case TravelMode.DRIVING :
          icon = 'driving'
          typeMode = 'Voiture'
          break;
        case TravelMode.BICYCLING :
          icon = 'velo'
          typeMode = 'Vélo'
          break;
        case TravelMode.TRANSIT :
          icon = 'transit'
          typeMode = 'Transport en commun'
          break;
        case TravelMode.WALKING:
          icon = 'walking'
          typeMode = 'A pieds'
          break;
      }
      let transport: ModelTransport = {
        travel: m,
        icon: icon,
        favoris: false,
        moyen: typeMode,
        position: 2
      }

      this.transports.push(transport)
      this.transports.sort((a, b) => a.position - b.position);

    })

  }

  openMap(travelMode: TravelMode) {
    const mapOptions = {
      zoom: 12,
      center: { lat: this.lat, lng: this.long }
    };

    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
    const directionsDisplay = new google.maps.DirectionsRenderer({map});
    const direction = this.getDirectionByTravelMode(travelMode);

    directionsDisplay.setDirections(direction || this.allDirections[0]);
  }

  addToFavoris(i: number){


    this.transports[i].favoris = !this.transports[i].favoris
    this.transports[i].position = this.transports[i].favoris ? 1 : 2

    let typeMode = ''
    switch (this.transports[i].travel){
      case TravelMode.DRIVING :
        typeMode = 'Voiture'
        break;
      case TravelMode.BICYCLING :
        typeMode = 'Vélo'
        break;
      case TravelMode.TRANSIT :
        typeMode = 'Transport en commun'
        break;
      case TravelMode.WALKING:
        typeMode = 'A pieds'
        break;
    }


    if(this.transports[i].favoris){
      let histoT: ModelHistoTransport = {
        icon: this.transports[i].icon,
        depart: this.depart,
        arrivee: this.ville,
        date: new Date(),
        duree: this.getDuration(this.transports[i].travel),
        distance: this.getDistance(this.transports[i].travel),
        moyen: typeMode
      }

      let indexOfHisto = this.histos.findIndex(item => item.arrivee  === this.ville && item.depart == this.depart && item.moyen == typeMode)

      if(indexOfHisto == -1){
        this.histos.push(histoT)
      }



      //this.histos = this.supprimerDoublonsParNom(this.histos)
    }else{
      let indexOfHisto = this.histos.findIndex(item => item.arrivee  === this.ville && item.depart === this.depart && item.moyen === typeMode)

      if(indexOfHisto != -1){
        this.histos.splice(indexOfHisto, 1)
      }
    }

    this.transports.sort((a, b) => a.position - b.position);
    localStorage.setItem('historiqueTransport',JSON.stringify(this.histos))
    this.total = this.histos.length
  }

  supprimerDoublonsParNom(tableau: ModelHistoTransport[]) {
    const nomsUniques = new Set();
    return tableau.filter((objet) => {
      if (!nomsUniques.has(objet.date)) {
        nomsUniques.add(objet.date);
        return true;
      }
      return false;
    });
  }

  showHistorique() {
    if(!this.isHistory){
      let datas = localStorage.getItem('historiqueTransport')
      if(datas){
        this.histos = JSON.parse(datas)
      }
      this.isHistory = true
    }else{
      this.isHistory = false
    }
  }

  deleteHisto(i: number){
    this.histos.splice(i, 1)
    localStorage.setItem('historiqueTransport',JSON.stringify(this.histos))
    this.total = this.histos.length
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

  }

  changePage($event: number) {
    if(($event <= this.nombrePage) && ($event >= 1)) {
      this.p = $event
    }

  }

}
