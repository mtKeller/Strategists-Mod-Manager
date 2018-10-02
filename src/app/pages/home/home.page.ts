import { Component, Input, ChangeDetectorRef, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MainActions from '../../store/Main/Main.actions';
import * as FileSystemActions from '../../store/FileSystem/FileSystem.actions';
import { ActionTree, ActionTreeParams, ActionNode } from '../../model/ActionTree.class';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mhwDirectoryPath: any = 'Maybe something';
  mhwDirectoryMap: any = [];
  downloadManagerItems: any = null;
  modList: any = null;
  downloading = false;
  PlayButton: HTMLElement;
  @ViewChild('playButton')
  set playButton(ele) {
    setTimeout(() => {
      console.log('PLAY Button', ele);
      this.PlayButton = ele.nativeElement;
    }, 500);
  }
  OpenDirButton: HTMLElement;
  @ViewChild('openMhwDirButton')
  set openDirButton(ele) {
    setTimeout(() => {
      console.log('PLAY Button', ele);
      this.OpenDirButton = ele.nativeElement;
    }, 500);
  }
  OpenNexusButton: HTMLElement;
  @ViewChild('openNexusButton')
  set openNexusButton(ele) {
    setTimeout(() => {
      console.log('PLAY Button', ele);
      this.OpenNexusButton = ele.nativeElement;
    }, 500);
  }
  constructor(
    private store: Store<any>,
    private cdr: ChangeDetectorRef,
    public popoverController: PopoverController,
    private renderer: Renderer2,
    private el: ElementRef
    ) {
  }
  ngOnInit(): void {
    this.store.select(state => state.MainState.mhwDirectoryPath).subscribe(val => {
      this.mhwDirectoryPath = val;
      this.cdr.detectChanges();
    });
    this.store.select(state => state.MainState.mhwDirectoryMap).subscribe(val => {
      this.mhwDirectoryMap = val;
    });
    this.store.select(state => state.DownloadManagerState.currentFiles).subscribe(val => {
      this.downloadManagerItems = val;
      this.cdr.detectChanges();
    });
    this.store.select(state => state.ModManagerState.modList).subscribe(val => {
      this.modList = val;
      this.cdr.detectChanges();
    });
  }
  minimizeWindow() {
    this.store.dispatch(new MainActions.MinimizeWindow());
  }
  closeWindow() {
    this.store.dispatch(new MainActions.CloseWindow());
  }
  ripple($event, elem, id) {
    const pageX = $event.clientX;
    const pageY = $event.clientY;
    const buttonY = pageY - elem.offsetTop;
    const buttonX = pageX - elem.offsetLeft;
    const eleRef = document.getElementById(id);
    const ripplePlay = this.renderer.createElement('div');
    this.renderer.addClass(ripplePlay, 'ripple-effect');
    this.renderer.setStyle(ripplePlay, 'height', `${40}px`);
    this.renderer.setStyle(ripplePlay, 'width', `${40}px`);
    this.renderer.setStyle(ripplePlay, 'top', `${buttonY - 20}px`);
    this.renderer.setStyle(ripplePlay, 'left', `${buttonX - 20}px`);
    this.renderer.setStyle(ripplePlay, 'background', 'white');
    this.renderer.appendChild(eleRef, ripplePlay);

    setTimeout(() => {
      this.renderer.setStyle(ripplePlay, 'background', 'none');
      this.renderer.removeChild(eleRef, ripplePlay);
    }, 1000);
  }
  getMhwDirPath() {
    if (this.mhwDirectoryPath === null) {
      return 'No game path set.';
    } else {
      return this.mhwDirectoryPath;
    }
  }
  play($event) {
    this.ripple($event, this.PlayButton, 'play-button');
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
  openMhwDir($event) {
    if (this.mhwDirectoryPath !== null) {
      this.ripple($event, this.OpenDirButton, 'open-dir');
      this.store.dispatch(new MainActions.OpenMhwDirectory());
    }
  }
  openModNexus($event) {
    this.ripple($event, this.OpenNexusButton, 'open-nexus');
    this.store.dispatch(new MainActions.OpenModNexus);
  }
  testUnrar() {
    this.store.dispatch(new FileSystemActions.UnrarFile());
  }
}
