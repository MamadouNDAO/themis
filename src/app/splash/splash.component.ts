import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {Router} from "@angular/router";
import {ApiService} from "../services/api.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent extends BasePage implements OnInit, OnDestroy{
  isLoading: boolean = false
  isInputFocused = false;
  email: string = ''
  domaineSCI: string[] = ['letrot', 'france-galop', 'fnch', 'orpesc', 'lescourseshippiques'];
  domainePMU: string[] = ['pmu'];
  isSSO: boolean = true
  apiSso!: Subscription
  apiLogin!: Subscription
  constructor(injector: Injector, private router: Router, private api: ApiService) {
    super(injector);
  }

  ngOnInit(): void {
    this.onLoading()
  }

  onLoading(){
    this.isLoading = true
    setTimeout(() =>{
      this.isLoading = false
    }, 3000)
  }

  onInputFocus(idx: string) {
    this.isInputFocused = true;
  }

  onInputBlur(input: HTMLInputElement) {
      this.isInputFocused = input.value != '';
  }

  go() {
    this.isLoading = true
    var match = this.email.match(/@(.*?)\.(fr|com|net|org)/);
   // let host = this.email.split('@')[1]
    let host = match![1]
    if(this.domainePMU.includes(host)) {
      localStorage.setItem('theme', 'pmu')
    }else if(this.domaineSCI.includes(host)){
      localStorage.setItem('theme', 'sci')
    }
    setTimeout(() => {
      window.location.replace('/connexion')
    }, 3000)
  }

  login(){
    this.isLoading = true

    let data ={email: this.email, plainPassword: ""}
    let host = this.email.split('@')[1]

    if(this.isSSO) {
      this.apiSso = this.api.getUrlSSO(data).subscribe(
        resp => {
          if (resp != '""') {
            window.open(resp, '_blank')
            const interval = setInterval(() => {
              let tokenId = localStorage.getItem('tokenId')
              if(tokenId) {
                this.isLoading = false
                //Info user
               this.apiLogin = this.api.infoUser(tokenId).subscribe(
                  async resp => {
                    host = resp.user.organization.domain

                    localStorage.setItem("infoUser", JSON.stringify(resp.user))
                    localStorage.setItem('isUserlogged', 'logged')
                    localStorage.setItem('userId', resp.user.id)
                    setTimeout(() => {
                      this.actionConnect(host)
                    }, 2000)
                    //
                  }
                )

                clearInterval(interval);
              }
            }, 2000)

          }else {
            this.isSSO = false
            this.isLoading = false
            var match = this.email.match(/@(.*?)\.(fr|com|net|org)/);
            let host = match![1]
            if(this.domainePMU.includes(host)) {
              localStorage.setItem('theme', 'pmu')
            }else if(this.domaineSCI.includes(host)){
              localStorage.setItem('theme', 'sci')
            }
            localStorage.setItem('email', this.email)
            window.location.replace('/connexion')
          }
        }
      )
    }else{
      var match = this.email.match(/@(.*?)\.(fr|com|net|org)/);
      let host = match![1]
      if(this.domainePMU.includes(host)) {
        localStorage.setItem('theme', 'pmu')
      }else if(this.domaineSCI.includes(host)){
        localStorage.setItem('theme', 'sci')
      }
      window.location.replace('/connexion')
    }

  }


  actionConnect(host: string, ) {
    let url = '/actualite';
    if(this.domainePMU.includes(host)) {
      localStorage.setItem('theme', 'pmu')

    }else if(this.domaineSCI.includes(host)){
      localStorage.setItem('theme', 'sci')

    }else{
      localStorage.setItem('theme', 'white')
    }
    this.isLoading = false
    location.href = url;
  }

  ngOnDestroy(): void {
    if(this.apiSso){this.apiSso.unsubscribe()}
    if(this.apiLogin){this.apiLogin.unsubscribe()}

  }

}

