import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SplashComponent} from "./splash/splash.component";
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ActualiteComponent} from "./actualite/actualite.component";
import {ReservationComponent} from "./reservation/reservation.component";
import {MeteoComponent} from "./meteo/meteo.component";
import {TransportComponent} from "./transport/transport.component";
import {ConstatComponent} from "./constat/constat.component";
import {CartographieComponent} from "./cartographie/cartographie.component";
import {SettingComponent} from "./setting/setting.component";
import {RestaurationComponent} from "./restauration/restauration.component";
import {CseComponent} from "./cse/cse.component";
import {QuartierComponent} from "./quartier/quartier.component";
import {IntranetComponent} from "./intranet/intranet.component";
import {SsoComponent} from "./sso/sso.component";
import {InscriptionComponent} from "./inscription/inscription.component";

const routes: Routes = [
  {path: '', component: SplashComponent},
  {path: 'connexion', component: LoginComponent},
  {path: 'inscription', component: InscriptionComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'actualite', component: ActualiteComponent},
  {path: 'reservation', component: ReservationComponent},
  {path: 'restauration', component: RestaurationComponent},
  {path: 'meteo', component: MeteoComponent},
  {path: 'transport', component: TransportComponent},
  {path: 'incidents', component: ConstatComponent},
  {path: 'cartographie', component: CartographieComponent},
  {path: 'parametres', component: SettingComponent},
  {path: 'cse', component: CseComponent},
  {path: 'quartier', component: QuartierComponent},
  {path: 'intranet', component: IntranetComponent},
  {path: 'login-sso', component: SsoComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
