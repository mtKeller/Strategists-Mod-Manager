import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MainActions from '../../store/Main/Main.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor(private store: Store<any>) { }
 clickMe() {
   this.store.dispatch(new MainActions.CloseWindow);
   console.log('Yup');
 }
}
