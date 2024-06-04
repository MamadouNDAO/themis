import { Component } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  constructor() {
  }
  text: string = 'Action fait avec succès !'
  isSucces: boolean = false
  isError: boolean = false



}
