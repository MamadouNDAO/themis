import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {Router} from "@angular/router";
import {ApiService} from "../services/api.service";
import {CreateUser} from "../Model/ModelData";

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent extends BasePage implements OnInit, OnDestroy {
  isLoading: boolean = false
  isInputFocused = false;
  isInputFocused3 = false;
  isInputFocused4 = false;
  isInput2Focused = false;
  email!: string
  password!: string
  nameIcone = 'visibility_off'

  prenom: string = ''
  nom: string = ''

  constructor(injector: Injector, private router: Router, private api: ApiService) {
    super(injector);
  }

  ngOnInit(): void {


  }

  onInputFocus(idx: string) {

    switch (idx){
      case 'input1': this.isInputFocused = true;
        break;
      case 'input2': this.isInput2Focused = true;
        break;
      case 'input3': this.isInputFocused3 = true
        break;
      case 'input4': this.isInputFocused4 = true
    }
  }

  onInputBlur(input: HTMLInputElement, idx: string) {
    switch (idx){
      case 'input1': this.isInputFocused = input.value != '';
        break;
      case 'input2': this.isInput2Focused = input.value != '';
      break;
      case 'input3': this.isInputFocused3 = input.value != ''
        break;
      case 'input4': this.isInputFocused4 = input.value != ''
    }
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

  submit(){
    this.isLoading = true
    let data: CreateUser = {
      firstname: this.prenom,
      lastname: this.nom,
      email: this.email,
      password: this.password
    }

    this.api.inscription(data).subscribe(
      resp => {
        this.isLoading = false
        this.showSuccess("Vous êtes inscrit avec succès !")
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 2000)
      },
      err => {
        this.isLoading = false
        this.showError("Cette adresse email existe déjà !")
      }
    )
  }

  showSuccess(msg: string) {
    this.showToast(true, false, msg)
  }

  showError(msg: string) {
    this.showToast(false, true, msg)
  }


  ngOnDestroy() {
  }
}
