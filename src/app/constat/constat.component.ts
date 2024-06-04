import {Component, Injector, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {ActivatedRoute, Router} from "@angular/router";
import {ModelHistoConst, ModelIncident, ModelNotif, ModelPriority} from "../Model/ModelData";
import {FixtureService} from "../Model/fixture.service";
import {Observable, Subscriber} from "rxjs";
import {ApiService} from "../services/api.service";
import {FormControl} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {FileValidators} from "ngx-file-drag-drop";

interface ModelSalle{
  id: string,
  name: string
}

@Component({
  selector: 'app-constat',
  templateUrl: './constat.component.html',
  styleUrls: ['./constat.component.scss']
})
export class ConstatComponent extends BasePage implements OnInit{
  isHistorique: boolean = false
  incidents: ModelIncident[] = []
  seletedImg: any = "assets/icon/img-constat.png"
  salles: ModelSalle[] = []
  salleNames: string[] = []
  filteredValues: string[] = []
  filteredDesti: string[] = []
  fileName!: string
  DestiName: string[] = []
  priorites: ModelPriority[] = []
  priorityNames: string[] = []
  desc: any
  titleConstat: any
  slectedSalle: string = ''
  slectedDesti: string = ''
  selectdSalle: string = ''
  selectdPriority: string = ''
  destis: any
  champImg: any
  idUser!: string
  historiks: ModelHistoConst[] = []
  nbNotif: number = 0
  public myControl!: FormControl;
  isLoading: boolean = false;
  isNotif: boolean = false;
  notifs: ModelNotif[] = [];
  imageBi: any
  attachement: any
  urlImageCst = "https://themis-documents.s3.eu-west-3.amazonaws.com/images/intervention/"

  colorDragger = this.theme.color == 'pmu-color' ? "#013E17" : "#AB310D"

  fileControl = new FormControl(
    [],
    [FileValidators.required, FileValidators.maxFileCount(1)]
  );

  constructor(injector: Injector, private router: Router, private fixture: FixtureService, private api: ApiService, private datePipe: DatePipe, private route: ActivatedRoute,) {
    super(injector);
  }

  getIdUser() {
    let infos = localStorage.getItem("infoUser")
    if(infos){
      this.idUser = JSON.parse(infos).id
    }
  }

  ngOnInit(): void {
    this.incidents = this.fixture.incidents
    this.getSalles()
    this.getDesti()
    this.getIdUser()
    this.getNombreNotif()
    //this.getHistoriques()
    this.getPriority()
    setTimeout(() => {
      if(localStorage.getItem('IdSalleCartoConstat')){
        let id = localStorage.getItem('IdSalleCartoConstat')

        let sal = this.salles.find(s => s.id == id )

        if(sal){
          this.selectdSalle = sal.name
          localStorage.removeItem('IdSalleCartoConstat')
        }

      }
    }, 1500)

  }




  showHistory() {
    if(!this.isHistorique){
      this.getHistoriques()
    }

    this.isHistorique = !this.isHistorique
  }

  getIconHistory() {
    let icon = ''
    if(this.isHistorique){
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

  displayFileName(event: any): void {

    const fileInput = event.target.files[0];
    this.seletedImg = fileInput;
    this.converTobase64(fileInput)
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

  getSalles(){
    this.api.getSallesConstat().subscribe(
      resp => {
        this.salles = resp

        this.salles.map((s) => {
          this.salleNames.push(s.name)
        })
      }
    )
  }

  filtre(esp: HTMLInputElement){
    this.filteredValues = this.salleNames.filter(e =>
      e.toLowerCase().includes(esp.value.toString().toLowerCase())
    );
  }

  filtreD(esp: HTMLInputElement){
    this.filteredDesti = this.DestiName.filter(e =>
      e.toLowerCase().includes(esp.value.toString().toLowerCase())
    );
  }

  getDesti(){
    this.api.getCategories().subscribe(
      resp => {
        console.log(resp)
        this.destis = resp
        resp.map((s: any) => {
          this.DestiName.push(s.name)
        })

      }
    )
  }

  actionToConstat(){
    //this.loadingService.present("En cours d'envoie")
    this.isLoading = true

      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'yyyyMMdd-HHmmss');
      let priorit = this.priorites.find((p:ModelPriority) => p.libelle == this.selectdPriority)
      let dataSCI = {
        image: this.imageBi,
        description: this.desc,
        title: this.titleConstat,
        label: "Themis-" + formattedDate,
        priority: priorit?.id
      }
      let desti = this.destis.find((d:any) => d.name == this.slectedDesti)


      let dataPMU = {
        image: this.imageBi,
        description: this.desc,
        title: this.titleConstat,
        label: "Themis-" + formattedDate,
        category_id: desti.id,
        priority: priorit?.id
      }
      let salle = this.salles.find(s => s.name == this.selectdSalle)
      let salleId = salle?.id
      let data = localStorage.getItem("theme") === "pmu" ? dataPMU : dataSCI
      const formData = new FormData();
      formData.append('image', data.image);
      formData.append('title', data.title)
      formData.append('label', data.label)
      formData.append('description', data.description)
      formData.append('attachment', this.attachement)
      if(priorit){
        formData.append('priority', priorit.id.toString())
      }

      if(localStorage.getItem("theme") === "pmu"){
        formData.append('category_id', dataPMU.category_id.toString())
      }


      this.api.sendConstat(formData, salleId).subscribe(
        response => {

          this.isLoading = false
          if (response) {
              this.showSuccess("Constat envoyé avec succès !")


            this.seletedImg = 'assets/icon/img-constat.png';
            this.desc = ''
            this.selectdSalle = ''
            this.titleConstat = ''
            this.slectedDesti = ''
            this.champImg = ''
            this.attachement = null
            setTimeout(() => {
             // this.getUserConstHistorique()

            }, 1000);

          }


        },
        error1 => {
          this.isLoading = false
          this.showError("Constat non envoyé !")
        }
      )

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

  getHistoriques() {
    this.isLoading = true
    this.api.getHistoryConstat(this.idUser).subscribe(
      resp => {
        console.log(resp)
        this.historiks = resp
        this.isLoading = false
      },
      err => {
        this.isLoading = false
        this.showError("Une erreur s'est produite lors du chargement !")
      }
    )
  }

  showSuccess(msg: string) {
    this.showToast(true, false, msg)
    this.setNotif('constat', msg)
    this.getNombreNotif()
  }

  getNombreNotif(){
    this.nbNotif = this.getNbNotif('constat')
  }

  showError(msg: string) {
    this.showToast(false, true, msg)
    this.setNotif('constat', msg)
    this.getNombreNotif()
  }

  showNotif() {
    this.notifs = this.getNotif('constat')
    this.isNotif = !this.isNotif
    this.readNotif('constat')
    this.getNombreNotif()
  }

  getPriority(){
    this.api.getPriorite().subscribe(
      resp => {
        console.log(resp)
        this.priorites = resp
        resp.map((p: any) => {
          this.priorityNames.push(p.libelle)
        })

      }
    )
  }

  getFile(event: any){
    this.attachement = event.target.files[0]

    console.log(this.attachement)
  }

  removeAttachement() {
    this.attachement = null
  }

}
