import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MainActions from '../../store/Main/Main.actions';
import * as FileSystemActions from '../../store/FileSystem/FileSystem.actions';
import { ActionChain, ActionChainParams } from '../../model/ActionChain.class';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor(private store: Store<any>) { }
  clickMe() {
    // const actionParams: ActionChainParams = {
    //   payload: 'package.json',
    //   success: new FileSystemActions.ReadFileSuccess,
    //   failed: new FileSystemActions.FileSystemFailure
    // };
    // this.store.dispatch(new FileSystemActions.ReadFile(new ActionChain(actionParams)));
    console.log('Click did slick.');
  }
}
