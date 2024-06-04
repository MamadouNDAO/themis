import { Injectable } from '@angular/core';
import {
  ModelAlarme,
  ModelHistoRiqueReservation,
  ModelIncident,
  ModelMeteo,
  ModelReservation,
  ModelSetting,
  ModelTransport
} from "./ModelData";

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  reservations: ModelReservation[] = [
    {id: 1, room: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 2, room: 'Salon Auteil', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 3, room: 'Salon Deauville', etage: 'Etage 2', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 4, room: 'Salon Cambargo', etage: 'Etage 2', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 5, room: 'Salon Chantily', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 6, room: 'Salon Scrabble', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 7, room: 'Salon Angers', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 8, room: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 9, room: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: true},
    {id: 10, room: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 11, room: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 12, room: 'Salon Angers', etage: 'Etage 5', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 13, room: 'Salon Angers', etage: 'Etage 5', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 14, room: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 15, room: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 16, room: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 17, room: 'Salon Angers', etage: 'Etage 6', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 18, room: 'Salon Angers', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 19, room: 'Salon Angers', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 20, room: 'Salon Angers', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 21, room: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 22, room: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 23, room: 'Salon Angers', etage: 'Etage 7', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 24, room: 'Salon Angers', etage: 'Etage 5', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 25, room: 'Salon Angers', etage: 'Etage 5', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 26, room: 'Salon Angers', etage: 'Etage 6', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 27, room: 'Salon Angers', etage: 'Etage 6', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 28, room: 'Salon Angers', etage: 'Etage 6', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 29, room: 'Salon Angers', etage: 'Etage 2', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
    {id: 30, room: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', capacite: '8 personnes', disponibilte: "Libre jusqu'à 9:37 AM", selected: false},
  ]

  alarmes: ModelAlarme[] = [
    {id: 1, espace: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 2, espace: 'Salon Auteil', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 3, espace: 'Salon Deauville', etage: 'Etage 2', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 4, espace: 'Salon Cambargo', etage: 'Etage 2', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: true},
    {id: 5, espace: 'Salon Chantily', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Critique", selected: false},
    {id: 6, espace: 'Salon Scrabble', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Critique", selected: false},
    {id: 7, espace: 'Salon Angers', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 8, espace: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 9, espace: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 10, espace: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 11, espace: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 12, espace: 'Salon Angers', etage: 'Etage 5', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 13, espace: 'Salon Angers', etage: 'Etage 5', site: 'Le Themis', entite: 'France Galop', motif: 'Incendie', gravite: "Faible", selected: false},
    {id: 14, espace: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', motif: "Fuite d'eau", gravite: "Critique", selected: false},
    {id: 15, espace: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', motif: "Fuite d'eau", gravite: "Critique", selected: false},
    {id: 16, espace: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', motif: "Fuite d'eau", gravite: "Critique", selected: false},
    {id: 17, espace: 'Salon Angers', etage: 'Etage 6', site: 'Le Themis', entite: 'France Galop', motif: 'Intrusion', gravite: "Critique", selected: false},
    {id: 18, espace: 'Salon Angers', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', motif: 'Intrusion', gravite: "Critique", selected: false},
    {id: 19, espace: 'Salon Angers', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', motif: 'Surcapacité', gravite: "Faible", selected: false},
    {id: 20, espace: 'Salon Angers', etage: 'Etage 3', site: 'Le Themis', entite: 'France Galop', motif: '8 personnes', gravite: "Faible", selected: false},
    {id: 21, espace: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', motif: '8 personnes', gravite: "Faible", selected: false},
    {id: 22, espace: 'Salon Angers', etage: 'Etage 4', site: 'Le Themis', entite: 'France Galop', motif: '8 personnes', gravite: "Faible", selected: false},
    {id: 23, espace: 'Salon Angers', etage: 'Etage 7', site: 'Le Themis', entite: 'France Galop', motif: '8 personnes', gravite: "Faible", selected: false},
    {id: 24, espace: 'Salon Angers', etage: 'Etage 5', site: 'Le Themis', entite: 'France Galop', motif: 'Surcapacité', gravite: "Faible", selected: false},
    {id: 25, espace: 'Salon Angers', etage: 'Etage 5', site: 'Le Themis', entite: 'France Galop', motif: 'Surcapacité', gravite: "Critique", selected: false},
    {id: 26, espace: 'Salon Angers', etage: 'Etage 6', site: 'Le Themis', entite: 'France Galop', motif: 'Surcapacité', gravite: "Critique", selected: false},
    {id: 27, espace: 'Salon Angers', etage: 'Etage 6', site: 'Le Themis', entite: 'France Galop', motif: 'Intrusion', gravite: "Critique", selected: false},
    {id: 28, espace: 'Salon Angers', etage: 'Etage 6', site: 'Le Themis', entite: 'France Galop', motif: 'Intrusion', gravite: "Critique", selected: false},
    {id: 29, espace: 'Salon Angers', etage: 'Etage 2', site: 'Le Themis', entite: 'France Galop', motif: "Fuite d'eau", gravite: "Critique", selected: false},
    {id: 30, espace: 'Salon Angers', etage: 'Etage 1', site: 'Le Themis', entite: 'France Galop', motif: "Fuite d'eau", gravite: "Critique", selected: false},
  ]

  meteos: ModelMeteo[] = [
    {id: 1, lieu: 'Paris', humidite: '78%', pression: '1020', vent: '6.69 km/h', date: '29 sept 2023, 11:29:56', favoris: true, climat: 'pluie'},
    {id: 2, lieu: 'Nice', humidite: '10%', pression: '1020', vent: '169 km/h', date: '29 sept 2023, 11:29:56', favoris: true, climat: 'soleil'},
    {id: 3, lieu: 'Lyon', humidite: '78%', pression: '1020', vent: '6.69 km/h', date: '29 sept 2023, 11:29:56', favoris: false, climat: 'pluie'},
    {id: 4, lieu: 'Bordeaux', humidite: '78%', pression: '1020', vent: '6.69 km/h', date: '29 sept 2023, 11:29:56', favoris: false, climat: 'soleil'},
    {id: 5, lieu: 'Marseille', humidite: '78%', pression: '1020', vent: '6.69 km/h', date: '29 sept 2023, 11:29:56', favoris: false, climat: 'nuage-soleil'},
    {id: 6, lieu: 'Montpelier', humidite: '78%', pression: '1020', vent: '6.69 km/h', date: '29 sept 2023, 11:29:56', favoris: false, climat: 'pluie'},
    {id: 7, lieu: 'Toulouse', humidite: '78%', pression: '1020', vent: '6.69 km/h', date: '29 sept 2023, 11:29:56', favoris: false, climat: 'nuage-soleil'}
  ]

  incidents: ModelIncident[] = [
    {id: 1, room: 'Bureau 203', titre: 'Chaise cassée', image: 'image-01', criticite: 'Moyenne', categorie: 'Service généreaux', contenu: "Le fauteuil de bureau présente des roulettes défectueuses,entravant la mobilité de l'utilisateur.", ticket: '034584'},
    {id: 2, room: 'Salle de réunion B', titre: 'Ordinateur défaillant', image: 'image-02', criticite: 'Elevée', categorie: 'Service informatique', contenu: "L'ordinateur ne démarre pas correctement, empêchant la tenue des réunions prévues.", ticket: '078956'},
    {id: 3, room: 'Couloir principal', titre: 'Eclairage en panne', image: 'image-03', criticite: 'Urgente', categorie: 'Maintenance', contenu: "Les ampoules du couloir principal sont hors service, créant un environnement de travail peu sûr en raison de l'obscurité.", ticket: '023658'},
  ]

 /* settings: ModelSetting[] = [
    {id: 1, icone: 'notification', type: 'Notifications', domaine: "Déclaration d'incidents", descriptif: 'Activation / Desactivation des notifications', toggle: false, value: ''},
    {id: 2, icone: 'notification', type: 'Notifications', domaine: "Météo", descriptif: 'Activation / Desactivation des notifications', toggle: true, value: ''},
    {id: 3, icone: 'setting', type: 'Paramétres', domaine: "Cartographie", descriptif: 'Diametre de la zone de recherche par defaut', toggle: false, value: '50 Km'},
  ]*/

  transports: ModelTransport[] = [
   /* {icon: 'driving', moyen: 'Voiture personnelle', distance: '87 Km', duree: '45h', favoris: true},
    {icon: 'walking', moyen: 'A pied', distance: '100 Km', duree: '37 min', favoris: false},
    {icon: 'transit', moyen: 'Voiture en commun', distance: '90 Km', duree: '45 min', favoris: false},
    {icon: 'taxi', moyen: 'Taxi', distance: '458 Km', duree: '2h', favoris: false},*/
  ]

  historiques: ModelHistoRiqueReservation[] = [
    {id: 'abc', name: 'Salon Angers', date: '17 septembre', debut: '17h30', fin: '18h00', capacite: '8 personnes', status: 'A venir', selected: false},
    {id: 'abcd', name: 'Salon Angers', date: '17 septembre', debut: '17h30', fin: '18h00', capacite: '8 personnes', status: 'A venir', selected: true},
    {id: 'abce', name: 'Salon Angers', date: '17 septembre', debut: '17h30', fin: '18h00', capacite: '8 personnes', status: 'A venir', selected: false},
    {id: 'abcf', name: 'Salon Angers', date: '17 septembre', debut: '17h30', fin: '18h00', capacite: '8 personnes', status: 'A venir', selected: false}
  ]
  constructor() { }
}
