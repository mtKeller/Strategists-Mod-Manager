import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MainActions from '../../store/Main/Main.actions';
import * as FileSystemActions from '../../store/FileSystem/FileSystem.actions';
import { ActionTree, ActionTreeParams, ActionNode } from '../../model/ActionTree.class';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  mhwDirectoryPath: any = 'Maybe something';
  mhwDirectoryMap: any = [];
  mhwDirectoryMapped: boolean;
  downloadManagerItems: any = null;
  downloading = false;
  constructor(private store: Store<any>, private cdr: ChangeDetectorRef) {
    this.mhwDirectoryMapped = false;
  }
  ngOnInit(): void {
    this.store.select(state => state.MainState.mhwDirectoryPath).subscribe(val => {
      this.mhwDirectoryPath = val;
      this.cdr.detectChanges();
    });
    this.store.select(state => state.MainState.mhwDirectoryMap).subscribe(val => {
      if (val === []) {
        this.mhwDirectoryMapped = false;
      } else {
        this.mhwDirectoryMapped = true;
        this.cdr.detectChanges();
      }
      this.mhwDirectoryMap = val;
    });
    this.store.select(state => state.DownloadManagerState.currentFiles).subscribe(val => {
      this.downloadManagerItems = val;
      this.cdr.detectChanges();
    });
  }
  getMhwDirPath() {
    if (this.mhwDirectoryPath === null) {
      return 'No game path set.';
    } else {
      return this.mhwDirectoryPath;
    }
  }
  play() {
    // const ActionNodeZipFile: ActionNode = {
    //   initAction: new FileSystemActions.ZipDir(),
    //   successAction: null,
    //   failedAction: null
    // };
    // const actionChainParams: ActionChainParams = {
    //   payload: ['', ''],
    //   actionNode: ActionNodeZipFile,
    //   store: this.store,
    // };
    // const zipChain: ActionChain = new ActionChain(actionChainParams);
    // zipChain.init();
    // this.store.dispatch(new MainActions.SaveState());
    this.store.dispatch(new MainActions.Play());
  }
  launchWideScreenFix() {
    const ExecWideScreenFix: ActionNode = {
      initAction: new FileSystemActions.ExecProcess(),
      successNode: null,
      failureNode: null
    };
    const actionChainParams: ActionTreeParams = {
      payload: 'C:\\Users\\Micah\\Downloads\\Lazy_Aspect_Fix_For_The_Patch_That_Finally_Fixed_Something.exe',
      actionNode: ExecWideScreenFix,
      store: this.store,
    };
    const execChain: ActionTree = new ActionTree(actionChainParams);
    execChain.init();
  }
  testClick() {
    this.store.dispatch(new MainActions.OpenModNexus);
    console.log('Slick did click');
  }
}
