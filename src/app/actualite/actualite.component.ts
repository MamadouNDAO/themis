import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {ApiService} from "../services/api.service";
import {Subscription} from "rxjs";
import {ModelActu, ModelComment} from "../Model/ModelData";
import {id} from "date-fns/locale";
import {ToastComponent} from "../shared/toast/toast.component";


@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrls: ['./actualite.component.scss']
})
export class ActualiteComponent extends BasePage implements OnInit, OnDestroy{
  apiActu!: Subscription
  apiFavoris!: Subscription
  actualites: ModelActu[] = []
  favorites: ModelActu[] = []
  idUser!: string
  isLoading: boolean = false
  idPostToComment!: number
  isComment: boolean = false
  comments: ModelComment[] = []
  imageToDisplay: string = ''


  constructor(injector: Injector, private api: ApiService) {
    super(injector);
  }

  ngOnInit(): void {
    this.getRoleUser()
    this.getActus()
  }

  getActus() {
    this.isLoading = true
    this.apiActu = this.api.getActualite().subscribe(
      resp => {
        this.actualites = resp
        console.log(this.actualites)
        this.favorites = this.actualites.filter((i) => {
          return i.favorites.includes(this.idUser)
        })
        this.isLoading = false
      }
    )
  }

  getRoleUser() {
    let infos = localStorage.getItem("infoUser")
    if(infos){
      console.log(JSON.parse(infos).id)
      this.idUser = JSON.parse(infos).id
    }
  }

  addToFavoris(idPost: number, index: number) {
    this.favorites.unshift(this.actualites[index])
    this.actualites[index].favorites.push(this.idUser)
    this.showSuccess('Post ajouté aux favoris avec succès !')
    this.apiFavoris = this.api.setFavoris(idPost).subscribe(
      resp => {
        return
      }
    )

    this.favorites.sort()

  }

  addToLike(idPost: number, index: number) {
    this.actualites[index].likes.push(this.idUser)
    let indexOfFavoris = this.favorites.findIndex(item => item.id === idPost)
    if(this.favorites[indexOfFavoris].likes) {
      this.favorites[indexOfFavoris].likes.push(this.idUser)
    }
    this.apiFavoris = this.api.setLike(idPost).subscribe(
      resp => {
        return
      }
    )

  }

  openComment(Actu: ModelActu){
    this.idPostToComment = Actu.id
    this.comments = Actu.comments
    this.isComment = true
  }

  closeComment(){
    this.isComment = false
  }

  removeToLike(idPost: number, index: any = null) {
    if(index){
      this.favorites.splice(index, 1)
    }else{
      let indexOfFavoris = this.favorites.findIndex(item => item.id === idPost)
      let indexDuUser = this.favorites[indexOfFavoris].likes.findIndex(iUser => iUser === this.idUser)
      this.favorites[indexOfFavoris].likes.splice(indexDuUser, 1)
    }

    let indexDeLactu = this.actualites.findIndex(item => item.id  === idPost)
    let indexDuUser = this.actualites[indexDeLactu].likes.findIndex(iUser => iUser === this.idUser)
    this.actualites[indexDeLactu].likes.splice(indexDuUser, 1)
    this.apiFavoris = this.api.setLike(idPost).subscribe(
      resp => {
        return
      }
    )
  }

  removeToFavoris(idPost: number, index: any = null) {
    if(index){
      this.favorites.splice(index, 1)
    }else{
      let indexOfFavoris = this.favorites.findIndex(item => item.id === idPost)
      this.favorites.splice(indexOfFavoris, 1)
    }

    let indexDeLactu = this.actualites.findIndex(item => item.id  === idPost)
    let indexDuUser = this.actualites[indexDeLactu].favorites.findIndex(iUser => iUser === this.idUser)
    this.actualites[indexDeLactu].favorites.splice(indexDuUser, 1)
    this.showSuccess('Post supprimé des favoris avec succès !')
    this.apiFavoris = this.api.setFavoris(idPost).subscribe(
      resp => {
        return
      }
    )
  }

  addComment(commt: HTMLTextAreaElement){
    let data = {
      postId: this.idPostToComment,
      message: commt.value
    }
    let indexDeLactu = this.actualites.findIndex(item => item.id  === this.idPostToComment)

    this.api.setComment(data).subscribe(
      resp => {
        this.isComment = false
        this.showSuccess('Commentaire ajouté avec succès !')
        this.getActus()
      }
    )
    this.isComment = false
  }

  showSuccess(msg: string) {
    this.showToast(true, false, msg)
  }

  showError(msg: string) {
    this.showToast(false, true, msg)
  }

  getImage(item: ModelActu) {
   /* if(this.theme.color == "pmu-color"){
      this.imageToDisplay = "assets/images/news/news1.png"
    }else if(item.pictures.length > 0){
      this.imageToDisplay = item.pictures[0].image
    }else{
      this.imageToDisplay = "assets/images/news/news1.png"
    }*/

    if(item.pictures.length > 0){
      this.imageToDisplay = item.pictures[0].image
    }else{
      this.imageToDisplay = "assets/images/news/news1.png"
    }

    return this.imageToDisplay
  }

  ngOnDestroy(): void {
    if(this.apiActu){ this.apiActu.unsubscribe() }
    if(this.apiFavoris){ this.apiFavoris.unsubscribe() }
  }
}
