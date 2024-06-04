import {Component, Injector, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {FixtureService} from "../Model/fixture.service";

@Component({
  selector: 'app-cse',
  templateUrl: './cse.component.html',
  styleUrls: ['./cse.component.scss']
})
export class CseComponent extends BasePage implements OnInit   {

  constructor(injector: Injector, private fixture: FixtureService) {
    super(injector);
  }

  ngOnInit(): void {
    this.openLink()
  }

  openLink() {
    let url = "https://www.csepmu.fr/com/login?back_url=%2Fcom%2Fhomepage"
    window.open(url, '_blank');
  }
}
