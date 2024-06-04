import {Component, Injector, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {FixtureService} from "../Model/fixture.service";
import {ModelSetting} from "../Model/ModelData";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent  extends BasePage implements OnInit {
  settings: ModelSetting[] = []
  constructor(injector: Injector, private fixture: FixtureService, private api: ApiService) {
    super(injector);
  }

  ngOnInit(): void {
   // this.settings = this.fixture.settings
    this.getService()
  }

  toggleItem(i: number) {
    this.settings[i].stateNotification = !this.settings[i].stateNotification
  }

  getService(){
    this.api.listService().subscribe(
      resp => {
        console.log(resp)
        this.settings = resp
      }
    )
  }

  noAction(){

  }

  getDesc(item: ModelSetting){
    let desc = "Activation / Désactivation des notifications "
    console.log(item.label)
    switch (item.label){
      case 'Réservation' : desc+="de réservation"
        break;
      case 'Déclarer un incident': desc+="d'incidents"
        break;
      case 'Météo': desc+="de météo"
    }

    return desc
  }
}
