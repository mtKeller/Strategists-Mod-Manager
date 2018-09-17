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
  mhwDirectoryPath: any = 'Maybe something';
  mhwDirectoryMap: any;
  constructor(private store: Store<any>) {
    this.store.select(state => state.MainState.mhwDirectoryPath).subscribe(val => {
      this.mhwDirectoryPath = val;
    });
    this.store.select(state => state.MainState.mhwDirectoryMap).subscribe(val => {
      this.mhwDirectoryMap = val;
    });
  }
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
