import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements OnInit{
  isToken: boolean = false
  constructor(private route: Router) {
  }

  ngOnInit() {
    let currentUrl = this.route.url
    const params = new URLSearchParams(currentUrl.substring(currentUrl.indexOf('?')));

// Récupérer les valeurs des paramètres
    const tokenId = params.get('tokenId');
    const token = params.get('token');

    //console.log("tokenId :", tokenId);
    //console.log("token :", token);

    if(tokenId){
      this.isToken = true
      if(token){
        localStorage.setItem('userToken', token)
      }

      localStorage.setItem('tokenId', tokenId)

      setTimeout(() => {
        window.close()
      }, 2000)
    }
  }
}
