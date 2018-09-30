import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MainActions from '../../store/Main/Main.actions';
import * as FileSystemActions from '../../store/FileSystem/FileSystem.actions';
import { ActionTree, ActionTreeParams, ActionNode } from '../../model/ActionTree.class';
import { RemoveDownloadItem } from '../../store/DownloadManager/DownloadManager.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
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
    this.store.dispatch(new MainActions.Play());
  }
  launchWideScreenFix() {
    const ExecWideScreenFix: ActionNode = {
      initAction: new FileSystemActions.ExecProcess(),
      successNode: null,
      failureNode: null
    };
    const actionTreeParams: ActionTreeParams = {
      payload: 'C:\\Users\\Micah\\Downloads\\Lazy_Aspect_Fix_For_The_Patch_That_Finally_Fixed_Something.exe',
      actionNode: ExecWideScreenFix,
      store: this.store,
    };
    const execTree: ActionTree = new ActionTree(actionTreeParams);
    execTree.init();
  }
  openMhwDir() {
    if (this.mhwDirectoryPath !== null) {
      this.store.dispatch(new MainActions.OpenMhwDirectory());
    }
  }
  testClick() {
    this.store.dispatch(new MainActions.OpenModNexus);
    console.log('Slick did click');
  }
  testUnrar() {
    this.store.dispatch(new FileSystemActions.UnrarFile());
  }
}
