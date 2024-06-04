import {Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {BasePage} from "../../../themis-theme/base";
import {Router} from "@angular/router";
import {ModelEditUser, ModelUser} from "../../Model/ModelData";
import {Observable, Subscriber} from "rxjs";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent extends BasePage implements OnInit{
  panelOpen = false;
  panelSupport = false;
  panelServiceOpen = false;
  hPanel = 'h54'
  hPanelService = 'h54'
  hSupport = 'h54'
  iconArrow = 'arrow-bas.png'
  iconArrowService = 'arrow-bas.png'
  iconArrowSupport = 'arrow-bas.png'
  routeService = ['/reservation', '/incidents', '/transport', '/meteo', '/restauration', '/quartier', '/cse', '/intranet']
  stylePosition = 'enPoFixed'
  isThisRoute: boolean = false
  infoUser!: ModelUser
  hasPhoto: boolean = false
  editUser!: ModelEditUser
  isEdit: boolean = false
  champImg: any
  seletedImg: any = "assets/icon/edit/avatar.webp"
  isLoading: boolean = false;
  imageBi: any
  isDeleting: boolean = false;
  constructor(injector: Injector, private router: Router, private api: ApiService) {
    super(injector);
  }

  ngOnInit(): void {
    this.whoIsRoute()
    this.getInfoUser()
  }

  displayFileName(event: any): void {

    const fileInput = event.target.files[0];
    this.seletedImg = fileInput;
    this.converTobase64(fileInput)
  }

  showDesinscription() {
    this.isDeleting = true
  }

  converTobase64(file: File){
    const observable = new Observable((subscriber: Subscriber<any>) =>{
      this.readFile(file,subscriber)
    })

    observable.subscribe(d =>{
      this.seletedImg = d

    })
  }

  readFile(file: File, subscribe: Subscriber<any>){
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file)

    fileReader.onload = () =>{
      subscribe.next(fileReader.result)
      subscribe.complete()
    }

    fileReader.onerror = () =>{
      subscribe.error()
      subscribe.complete()

    }
  }

  onExpansion() {
    this.panelServiceOpen = false
    this.panelSupport = false
    this.hPanelService = 'h54'
    this.hSupport = 'h54'
    this.iconArrowService = 'arrow-bas.png'
    this.iconArrowSupport = 'arrow-bas.png'



    this.panelOpen = !this.panelOpen
    this.hPanel = this.hPanel == 'h54' ? 'hAuto' : 'h54'
    this.iconArrow = this.iconArrow == 'arrow-bas.png' ? 'arrow-top.png' : 'arrow-bas.png'
  }

  onExpansionService() {
    this.panelOpen = false
    this.panelSupport = false
    this.hPanel = 'h54'
    this.hSupport = 'h54'
    this.iconArrow = 'arrow-bas.png'
    this.iconArrowSupport = 'arrow-bas.png'


    this.panelServiceOpen = !this.panelServiceOpen
   /* if(this.theme.color == 'pmu-color'){
      this.stylePosition = this.panelServiceOpen ? 'enPoRelative' : 'enPoFixed'
    }else{
      this.stylePosition = 'enPoFixed'
    }*/
    this.stylePosition = this.panelServiceOpen ? 'enPoRelative' : 'enPoFixed'
    this.hPanelService = this.hPanelService == 'h54' ? 'hAuto' : 'h54'
    this.iconArrowService = this.iconArrowService == 'arrow-bas.png' ? 'arrow-top.png' : 'arrow-bas.png'
  }

  onExpansionSupport() {
    this.panelOpen = false
    this.panelServiceOpen = false
    this.hPanel = 'h54'
    this.hPanelService = 'h54'
    this.iconArrow = 'arrow-bas.png'
    this.iconArrowService = 'arrow-bas.png'

    this.panelSupport = !this.panelSupport
    if(this.theme.color == 'pmu-color'){
      this.stylePosition = this.panelServiceOpen ? 'enPoRelative' : 'enPoFixed'
    }else{
      this.stylePosition = 'enPoFixed'
    }

    this.hSupport = this.hSupport == 'h54' ? 'hAuto' : 'h54'
    this.iconArrowSupport = this.iconArrowSupport == 'arrow-bas.png' ? 'arrow-top.png' : 'arrow-bas.png'
  }

  isRouteActive(urlRoute: string) {
    if(this.router.url === urlRoute) return 'isActive'
    else return null
  }

  whoIsRoute() {
    if(this.routeService.includes(this.router.url)){
      this.onExpansionService()
      this.isThisRoute = true
    }else{
      this.isThisRoute = false
    }

  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/'])
  }

  getInfoUser() {
    let infos = localStorage.getItem("infoUser")
    if(infos){
      this.infoUser = (JSON).parse(infos)
    }

  }

  showEdit() {
    if(this.theme.color == 'sci-color'){
      let data = localStorage.getItem("infoUser")
      if(data){
        this.editUser = JSON.parse(data)
        this.isEdit = true
      }
    }

  }

  closeEdit(){
    this.isEdit = false
  }

  sendEditUser(){
    this.isLoading = true
    const formData = new FormData();

    if(this.seletedImg != 'assets/icon/edit/avatar.webp"'){
      formData.append('avatar', this.imageBi);
    }

    let data = {
      avatar: this.imageBi,
      firstname: this.editUser.firstname,
      lastname: this.editUser.lastname,
      email: this.editUser.email
    }

    formData.append('firstname', this.editUser.firstname);
    formData.append('lastname', this.editUser.lastname);
    formData.append('email', this.editUser.email);
    this.api.editUser(formData, this.infoUser.id).subscribe(
      resp => {
        this.isLoading = false
        // console.log(resp)
        localStorage.setItem("infoUser", JSON.stringify(resp))
        this.getInfoUser()
        this.onExpansion()

        this.showToast(true, false, "Profil modifié avec succès !")
        this.isEdit = false
      },
      error => {
        this.isLoading = false
        this.showToast(false, true, "Erreur lors de la modification !")
      }
    )
  }

  premiereLettre(nom: string): string {
    if(nom){
      return nom.charAt(0);
    }
    return "I"
  }

  getImageFile(event: any){
    if(event.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event:any)=>{
        this.seletedImg = event.target.result;
      }
      const file = event.target!.files[0]!;
      this.imageBi = file
      //this.inscriptForm.controls['photo'].setValue(file);
    }
    //console.log(this.urlImage)
  }


  closeDelete() {
    this.isDeleting = false
  }

  desinscrire() {
    this.api.desinscription().subscribe(
      resp => {
        this.showToast(true, false, "Désinscription effectuée avec succès !")
        this.logout()
      }
    )
  }
}
