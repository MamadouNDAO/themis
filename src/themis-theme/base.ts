import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import themePmu from "./theme-pmu";
import themeSci from "./theme-sci";
import themeWhite from "./theme-white";
import {ModelNotif} from "../app/Model/ModelData";

@Component({
  template: ''
})

export abstract class BasePage{
  protected theme: any;
  isSupport: boolean = false

  text: string = ''
  isSucces: boolean = false
  isError: boolean = false
  notifications: ModelNotif[] = []

  constructor(injector: Injector) {
    if(localStorage.getItem('theme') === 'sci') this.theme = themeSci;
    else if(localStorage.getItem('theme') === 'pmu') this.theme = themePmu;
    else if(localStorage.getItem('theme') === 'white') this.theme = themeWhite;
    else this.theme = themeWhite;
  }

  getIconsHistory(isHistorique: boolean) {
    let icon = ''
    if(isHistorique){
      switch (this.theme.color){
        case 'sci-color': icon = 'historique-sci-actif'
          break;
        case 'pmu-color': icon = 'historique-pmu-actif'
          break;
      }
    }else{
      icon = 'historique'
    }

    return icon+'.png'
  }

  showSupp(){
    this.isSupport = !this.isSupport
  }

  showToast(isSucces: boolean, iserror: boolean, msg: string){
    this.isSucces = isSucces
    this.isError = iserror
    this.text = msg
    setTimeout(() => {
      this.isSucces = false
      this.isError = false
      this.text = ''
    },3000)
  }

  setNotif(type: string, label: string){
    if(localStorage.getItem('notifications')){
      let data = localStorage.getItem('notifications')
      if(data){
        this.notifications = JSON.parse(data)
      }
    }
    let notif: ModelNotif = {
      id: this.notifications.length+1,
      label: label,
      type: type,
      date: new Date(),
      isRead: false
    }
    this.notifications.push(notif)

    localStorage.setItem('notifications', JSON.stringify(this.notifications))
  }

  getNotif(type: string){
    if(localStorage.getItem('notifications')){
      let data = localStorage.getItem('notifications')
      if(data){
        this.notifications = JSON.parse(data)
      }
    }

    this.notifications = this.notifications.filter(n =>
      n.type.toLowerCase().includes(type.toLowerCase())
    )
    this.notifications.sort((a, b) => b.id - a.id);
    return this.notifications
  }

  readNotif(type: string){
    if(localStorage.getItem('notifications')){
      let data = localStorage.getItem('notifications')
      if(data){
        this.notifications = JSON.parse(data)
      }
    }



    this.notifications.map(n => {
      if(n.type == type){
        n.isRead = true
      }
    })
    localStorage.setItem('notifications', JSON.stringify(this.notifications))
  }

  getNbNotif(type: string){
    if(localStorage.getItem('notifications')){
      let data = localStorage.getItem('notifications')
      if(data){
        this.notifications = JSON.parse(data)
      }
    }

    this.notifications = this.notifications.filter(n =>
      n.type.toLowerCase().includes(type.toLowerCase()) && !n.isRead
    )
    return this.notifications.length
  }
}
