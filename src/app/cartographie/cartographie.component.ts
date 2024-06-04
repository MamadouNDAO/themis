import {Component, Injector, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {FixtureService} from "../Model/fixture.service";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-cartographie',
  templateUrl: './cartographie.component.html',
  styleUrls: ['./cartographie.component.scss']
})
export class CartographieComponent extends BasePage implements OnInit {

  constructor(injector: Injector, private fixture: FixtureService, private api: ApiService) {
    super(injector);
  }

  ngOnInit(): void {
    this.getSallesObscure()
    this.updateSalle()
    setInterval(()=> {
      if(localStorage.getItem("userToken")){
        this.updateSalle()
      }

    },4000)

   // this.onIframeLoad()
  }

  getSallesObscure(){
    this.api.getSallesObscure().subscribe(
      resp => {
        const salleObscures: any[] = []

        resp.forEach((i: any) => {
          salleObscures.push(i.zone.mapwizeId)
        })
        localStorage.setItem("ObscuresRooms", JSON.stringify(salleObscures))

      }
    )
  }

  updateSalle(){
    this.api.getSalles("&availableonly=no").subscribe(
      resp => {
        const nomsEtages: any[] = [];

        resp.forEach((salle: any) => {
          if(salle.floor.name !== "Mezzanine"){
            if (!nomsEtages.includes(salle.floor.name.replace(/[A-Za-z]$/, ''))) {
              nomsEtages.push(salle.floor.name.replace(/[A-Za-z]$/, ''));
            }
          }else{
            if (!nomsEtages.includes(salle.floor.name)) {
              nomsEtages.push(salle.floor.name);
            }
          }


        });

        localStorage.setItem('Etages', JSON.stringify(nomsEtages))
        localStorage.setItem('ListRooms', JSON.stringify(resp))
        localStorage.setItem('finmode', 'ok')
        if(localStorage.getItem("Etages") && localStorage.getItem("ListRooms")){
          //this.isLoader = false

        }

      }
    )
  }


  onIframeLoad() {
    const iframeElement: HTMLIFrameElement | null = document.querySelector('iframe');

    if (iframeElement) {
      const buttonElement = iframeElement.contentDocument?.getElementById('btnReserver');
      const buttonConstat = iframeElement.contentDocument?.getElementById('btnConstat');

      if (buttonElement) {

        buttonElement.addEventListener('click', this.handleButtonClick);
      }

      if (buttonConstat) {
        buttonConstat.addEventListener('click', this.goToConstat);
      }

    }
  }

  handleButtonClick() {
    const interval = setInterval(() => {
      let id = localStorage.getItem('IdSalleCarto')

      if(id != null){
        window.location.replace('/reservation?id='+id)
      }
    }, 200)
  }

  goToConstat() {
    const interval = setInterval(() => {
      let id = localStorage.getItem('IdSalleCartoConstat')
      window.location.replace('/incidents')

    }, 200)

  }
}
