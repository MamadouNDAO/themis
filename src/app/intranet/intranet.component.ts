import {Component, Injector, OnInit} from '@angular/core';
import {FixtureService} from "../Model/fixture.service";
import {BasePage} from "../../themis-theme/base";

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.scss']
})
export class IntranetComponent extends BasePage implements OnInit  {

  constructor(injector: Injector, private fixture: FixtureService) {
    super(injector);
  }

  ngOnInit(): void {
    this.openLink()
  }

  openLink() {
    let url = "https://parimutuel.sharepoint.com/sites/intranet"
    window.open(url, '_blank');
  }
}
