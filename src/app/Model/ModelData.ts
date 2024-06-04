import TravelMode = google.maps.TravelMode;

export interface ModelReservation{
  id: number,
  room: string,
  etage: string,
  site: string,
  entite: string,
  capacite: string,
  disponibilte: string,
  selected: boolean
}


export interface ModelAlarme{
  id: number,
  motif: string,
  espace: string,
  etage: string,
  site: string,
  entite: string,
  gravite: string,
  selected: boolean
}

export interface ModelMeteo{
  id: number,
  lieu: string,
  humidite: string,
  pression: string,
  vent: string,
  date: string,
  favoris: boolean,
  climat: string
}

export interface ModelIncident{
  id: number,
  image: string,
  titre: string,
  room: string,
  criticite: string,
  categorie: string,
  contenu: string,
  ticket: string
}

export interface ModelSetting{
  id: number,
  icone: string,
  type: string,
  label: string,
  descriptif: string,
  toggle: boolean,
  value: string,
  stateNotification: boolean,
  haveNotification: boolean
}

export interface ModelTransport{
  icon: string,
  moyen: string,
  favoris: boolean,
  travel: TravelMode,
  position: number
}

export interface ModelUser{
  id: string,
  firstname: string,
  lastname: string,
  email: string,
  organization: any,
  role_description: string
}

export interface ModelEditUser{
  firstname: string,
  lastname: string,
  email: string,
  photo: string
}

export interface ModelProfilActu{
  id: number,
  name: string,
  image: string
}

export interface ModelActu{
  id: number,
  desc: string,
  createdAt: string,
  name: string,
  enabled: boolean,
  favorites: any[],
  likes: any[],
  pictures: any[],
  profile: ModelProfilActu,
  comments: ModelComment[]
}

export interface ModelRoom{
  id: string,
  name: string,
  occupation: boolean,
  site: string,
  floor: ModelFloor,
  reservationStatus: ModelReservStatut,
  zone: ModelZone,
  selected: boolean
}

export interface ModelFloor{
  id: string,
  name: string
}

export interface ModelReservStatut{
  message: string,
  state: string
}

export interface ModelZone{
  mapwizeId: string,
  maximumCapacity: number
}

export interface ModelHistoRiqueReservation{
  id: string,
  name: string,
  date: string,
  debut: string,
  fin: string,
  capacite: string,
  status: string,
  selected: boolean
}

export interface ModelHistory{
  id:number,
  dateStart: string,
  dateEnd: string,
  invites: string,
  subject: string,
  room: ModelRoomH,
  isCanceled: boolean,
  selected: boolean
}

export interface ModelRoomH{
  id: string,
  floor: string,
  name: string,
  site: string,
  technicalId: string
}

export interface WeatherModel{
  name: string,
  timezone: number,
  weather: WeatherDetail[],
  main: MainDetail,
  wind: WindDetail,
  favoris: boolean,
  position: number
}

export interface WeatherDetail{
  description: string,
  icon: string
}

export interface MainDetail{
  temp: number,
  temp_min: number,
  temp_max: number,
  pressure: number,
  humidity: number
}

export interface WindDetail{
  speed: number,
  deg: number
}

export interface ModelHistoTransport{
  icon: string,
  depart: string,
  arrivee: string,
  distance: string,
  duree: string,
  moyen: string,
  date: Date
}

export interface ModelComment{
  id: number,
  message: string,
  createdAt: string,
  author: ModelAuthor
}

export interface ModelAuthor{
  firstname: string,
  lastname: string
}


export interface CreateUser {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}

export interface ModelHistoConst{
  title: string,
  description: string,
  category: ModelCateg,
  image: string
  room: ModelRoomCat,
  status: string,
  label: string,
  statement: ModelStatement
}

export interface ModelStatement{
  image: string
}

export interface ModelCateg{
  name: string
}

export interface ModelRoomCat{
  id: string,
  name: string,
}

export interface ModelNotif{
  id: number,
  label: string,
  type: string,
  date: Date,
  isRead: boolean
}


export interface ModelPriority{
  id: number,
  libelle: string,
}
