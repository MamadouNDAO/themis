import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {Router} from "@angular/router";
import {ApiService} from "../services/api.service";
import {exhaustMap, Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BasePage implements OnInit, OnDestroy{
  isLoading: boolean = false
  isInputFocused = false;
  isInput2Focused = false;
  isInput3Focused = false;
  email!: string
  password!: string
  nameIcone = 'visibility_off'
  domaineSCI: string[] = ['letrot', 'france-galop', 'fnch', 'orpesc', 'lescourseshippiques'];
  domainePMU: string[] = ['pmu'];
  apiLogin!: Subscription
  emailReset!: string
  isReinit: boolean = false

  constructor(injector: Injector, private router: Router, private api: ApiService) {
    super(injector);
  }

  ngOnInit(): void {
    if(localStorage.getItem('email')){
      let em = localStorage.getItem('email')
      if(em){
        this.email = em
        this.isInputFocused = true
      }

    }

  }

  onLoading(){
    this.isLoading = true
    setTimeout(() =>{
      this.isLoading = false
    }, 3000)
  }

  onInputFocus(idx: string) {

    switch (idx){
      case 'input1': this.isInputFocused = true;
        break;
      case 'input2': this.isInput2Focused = true;
      break;
      case 'input3': this.isInput3Focused = true;
    }
  }

  onInputBlur(input: HTMLInputElement, idx: string) {
    switch (idx){
      case 'input1': this.isInputFocused = input.value != '';
        break;
      case 'input2': this.isInput2Focused = input.value != '';
      break;
      case 'input3': this.isInput3Focused = input.value != '';
    }
  }

  go() {
    this.isLoading = true
    setTimeout(() => {

      this.router.navigate(['/actualite'])
      this.isLoading = false
    }, 3000)
  }

  showHidePassword(input2: HTMLInputElement){
    switch (input2.type){
      case 'password':
        input2.type = 'text'
        this.nameIcone = 'visibility'
        break;
      case 'text':
        input2.type = 'password'
        this.nameIcone = 'visibility_off'
        break;
    }
  }

  loginClassic() {
    this.isLoading = true
    let data = {email: this.email, plainPassword: this.password}
    this.apiLogin = this.api.login(data).subscribe(
      response =>{

        if(response.user){
          let host = response.user.organization.domain
          localStorage.setItem("infoUser", JSON.stringify(response.user))
          localStorage.setItem('isUserlogged', 'logged')
          localStorage.setItem('userToken', response.token)
          localStorage.setItem('userId', response.user.id)
          this.isLoading = false
          this.actionConnect(host)

        }
      },
      error => {
        this.isLoading = false
        console.log(error.error.message)

      }
    )
  }

  actionConnect(host: string, ) {
    let url = "/actualite";
    if(this.domainePMU.includes(host)) {
      localStorage.setItem('theme', 'pmu')
    }else if(this.domaineSCI.includes(host)){
      localStorage.setItem('theme', 'sci')
    }
    this.isLoading = false
    location.href = url;
  }

  sendEmail(){

    if(this.emailReset != '') {
      this.isLoading = true
      let data = {
        email: this.emailReset,
        password: null
      }
        this.api.resetPassword(data).subscribe(
          resp => {
            console.log(resp)
            this.isLoading = false
            this.showToast(true, false, "Traitement réalisé avec succès! Veuillez vérifier votre email !")
            setTimeout(()=> {
              this.isReinit = false
            }, 1000)
          },
          error => {
            this.isLoading = false
            this.showToast(false, true, "Une erreu s'est produite lors du traitement !")

          }
        )
    }
  }

  closeReinit(){
    this.isReinit = false
  }

  openReinit(){
    this.isReinit = true
  }

  ngOnDestroy(): void {
    if(this.apiLogin){this.apiLogin.unsubscribe()}
  }

  protected readonly exhaustMap = exhaustMap;
}
