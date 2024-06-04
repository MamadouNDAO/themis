import {Component, Injector, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {FixtureService} from "../Model/fixture.service";

@Component({
  selector: 'app-quartier',
  templateUrl: './quartier.component.html',
  styleUrls: ['./quartier.component.scss']
})
export class QuartierComponent extends BasePage implements OnInit {

  constructor(injector: Injector, private fixture: FixtureService) {
    super(injector);
  }

  ngOnInit(): void {
    this.openLink()
  }

  openLink() {
    let url = "https://parimutuel.sharepoint.com/sites/EnsembleThmis/SitePages/City-guide.aspx"
    window.open(url, '_blank');
  }
}
