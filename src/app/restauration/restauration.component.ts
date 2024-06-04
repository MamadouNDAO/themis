import {Component, Injector, OnInit} from '@angular/core';
import {BasePage} from "../../themis-theme/base";
import {FixtureService} from "../Model/fixture.service";

@Component({
  selector: 'app-restauration',
  templateUrl: './restauration.component.html',
  styleUrls: ['./restauration.component.scss']
})
export class RestaurationComponent  extends BasePage implements OnInit  {

  constructor(injector: Injector, private fixture: FixtureService) {
    super(injector);
  }

  ngOnInit(): void {
  }
}
