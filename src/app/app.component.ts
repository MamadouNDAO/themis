import {Component, OnInit} from '@angular/core';
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'themis';

  ngOnInit(): void {
    //localStorage.setItem("theme", "sci")
    registerLocaleData(localeFr, 'fr');
  }
}
