import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { MinimizeWindow, CloseWindow} from '../../store/Main/Main.actions';

@Component({
  selector: 'app-ctrl-bar',
  templateUrl: './ctrl-bar.component.html',
  styleUrls: ['./ctrl-bar.component.scss']
})
export class CtrlBarComponent {
  constructor(private store: Store<any>) { }

  minimizeWindow() {
    this.store.dispatch(new MinimizeWindow());
  }
  closeWindow() {
    this.store.dispatch(new CloseWindow());
  }
}
