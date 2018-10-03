import { Component, Input, ChangeDetectorRef, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MainActions from '../../store/Main/Main.actions';
import * as FileSystemActions from '../../store/FileSystem/FileSystem.actions';
import * as ModManagerActions from '../../store/ModManager/ModManager.action';
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
  downloadManagerItems: any = [];
  modList: any = [];
  modListChildExpand: any = [];
  loadOrder: any = [];
  currentManagerTab = 'MOD_LIST';
  downloading = false;

  PlayButton: HTMLElement;
  @ViewChild('playButton')
  set playButton(ele) {
    setTimeout(() => {
      this.PlayButton = ele.nativeElement;
    }, 500);
  }
  OpenDirButton: HTMLElement;
  @ViewChild('openMhwDirButton')
  set openDirButton(ele) {
    setTimeout(() => {
      this.OpenDirButton = ele.nativeElement;
    }, 500);
  }
  OpenNexusButton: HTMLElement;
  @ViewChild('openNexusButton')
  set openNexusButton(ele) {
    setTimeout(() => {
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
      const newChildExpand = [];
      this.modList = val;
      for (let i = 0; i < val.length; i++) {
        newChildExpand.push(false);
      }
      this.modListChildExpand = newChildExpand;
      this.cdr.detectChanges();
    });
    this.store.select(state => state.ModManagerState.loadOrder).subscribe(val => {
      this.loadOrder = val;
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
  setTab(target) {
    this.currentManagerTab = target;
    this.cdr.detectChanges();
  }
  toggleChildExpand(index) {
    if (index !== null) {
      console.log(index, this.modListChildExpand[index]);
      this.modListChildExpand[index] = !this.modListChildExpand[index];
      console.log(index, this.modListChildExpand[index]);
    }
  }
  getExpandToggle(index) {
    // console.log(index, this.modListChildExpand[index]);
    if (index !== null || index !== undefined) {
      return this.modListChildExpand[index];
    }
    return false;
  }
  addToLoadOrder(arrOfIndexes) {
    const ActionNodeAddToLoadOrder: ActionNode = {
      initAction: new ModManagerActions.InsertToFrontOfLoadOrder(),
      successNode: null,
    };
    const ActionTreeParam: ActionTreeParams = {
      actionNode: ActionNodeAddToLoadOrder,
      payload: arrOfIndexes,
      store: this.store
    };
    const ActionTreeAddToLoadOrder: ActionTree = new ActionTree(ActionTreeParam);
    ActionTreeAddToLoadOrder.init();
    console.log('ADD TO LOAD ORDER TREE', ActionTreeAddToLoadOrder);
  }
  parseModChildTitle(str: string) {
    function replaceAll(st , search, replacement) {
      const target = st;
      return target.split(search).join(replacement);
    }
    // console.log(str.replace(/[0-9]/g, ''));
    let newStr = str.replace(/[0-9]/g, '');
    newStr = replaceAll(newStr, '_', '');
    newStr = replaceAll(newStr, '-', '');
    newStr = newStr.replace('.zip', '');
    newStr = newStr.replace('.rar', '');
    newStr = newStr.replace('.7z', '');
    return newStr;
  }
}
