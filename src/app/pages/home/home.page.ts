import { Component, Input, ChangeDetectorRef, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MainActions from '../../store/Main/Main.actions';
import * as FileSystemActions from '../../store/FileSystem/FileSystem.actions';
import * as ModManagerActions from '../../store/ModManager/ModManager.actions';
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

  processingQue: any = [];
  installationQue: any = [];
  modProcessing: false;

  modList: any = [];
  modListChildExpand: any = [];

  loadOrder: any = [];
  loadOrderBlink = false;

  currentManagerTab = 'LOAD_ORDER';
  downloading = false;

  galleryContent: any = null;
  galleryContentIndex = 0;
  galleryOpen = false;

  activeLoadOrderItem = null;
  activeLoadOrderIndex = 0;

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

    this.store.select(state => state.ModManagerState.installationQue).subscribe(val => {
      this.processingQue = val;
      this.cdr.detectChanges();
    });
    this.store.select(state => state.ModManagerState.processingQue).subscribe(val => {
      this.processingQue = val;
      this.cdr.detectChanges();
    });
    this.store.select(state => state.ModManagerState.modProcessing).subscribe(val => {
      this.modProcessing = val;
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
    // const buttonY = pageY - elem.offsetTop;
    // const buttonX = pageX - elem.offsetLeft;
    const buttonY = elem.getBoundingClientRect().top;
    const buttonX = elem.getBoundingClientRect().left;
    const eleRef = document.getElementById(id);
    // console.log(elem.getBoundingClientRect().left,
    // elem.getBoundingClientRect().top, $event.clientX, $event.clientY);
    const ripplePlay = this.renderer.createElement('div');
    this.renderer.addClass(ripplePlay, 'ripple-effect');
    this.renderer.setStyle(ripplePlay, 'height', `${40}px`);
    this.renderer.setStyle(ripplePlay, 'width', `${40}px`);
    this.renderer.setStyle(ripplePlay, 'top', `${pageY - buttonY - 20}px`);
    this.renderer.setStyle(ripplePlay, 'left', `${pageX - buttonX - 20}px`);
    this.renderer.setStyle(ripplePlay, 'background', 'cyan');
    this.renderer.appendChild(eleRef, ripplePlay);

    setTimeout(() => {
      // console.log(document.getElementsByClassName('ripple-effect'));
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
    // this.store.dispatch(new MainActions.Play());
    console.log(this.galleryOpen);
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
  setTab($event, id , target) {
    const elem = this.el.nativeElement.querySelector('#' + id);
    this.ripple($event, elem, id);
    this.currentManagerTab = target;
    this.cdr.detectChanges();
  }
  toggleChildExpand($event, index, idStr) {
    const elem = this.el.nativeElement.querySelector('#' + idStr + index);
    this.ripple($event, elem, idStr + index);
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
  addToLoadOrder($event, arrOfIndexes, idStr, modIndex, indexOfChild) {
    const elem = this.el.nativeElement.querySelector('#' + idStr + modIndex + indexOfChild);
    console.log(elem);
    console.log(document.getElementById(idStr + modIndex + indexOfChild));
    this.ripple($event, elem, idStr + modIndex + indexOfChild);
    this.blinkLoadOrder();
    this.store.dispatch(new ModManagerActions.InsertToFrontOfLoadOrder(arrOfIndexes));
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
    newStr = newStr.replace('.z', '');
    newStr = replaceAll(newStr, '.', '');
    return newStr;
  }
  openGallery(content) {
    this.galleryContent = content;
    this.galleryOpen = true;
    this.galleryContentIndex = 0;
  }
  closeGallery($event) {
    $event.stopPropagation();
    this.galleryContent = null;
    this.galleryOpen = false;
  }
  incrementGallery($event) {
    $event.stopPropagation();
    if (this.galleryContentIndex + 1 !== this.galleryContent.pictures.length) {
      this.galleryContentIndex += 1;
    } else {
      this.galleryContentIndex = 0;
    }
  }
  isGalleryOpen () {
    // console.log(this.galleryOpen);
    return this.galleryOpen;
  }
  blinkLoadOrder() {
    this.loadOrderBlink = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.loadOrderBlink = false;
      this.cdr.detectChanges();
    }, 50);
  }
  log(element) {
    console.log(element);
  }
  getAcronym(str) {
    const first = str.substring(0, 1);
    const splitString = str.split(' ');
    let newString = first;
    for (let i = 1; i < splitString.length; i++) {
      newString += splitString[i].substring(0, 1);
    }
    return newString.substring(0, 4);
  }
  limitChar(str) {
    const newStr = this.parseModChildTitle(str);
    if (newStr.length > 42) {
      return newStr.substring(0, 42) + '...';
    } else {
      return this.parseModChildTitle(str);
    }
  }
  getStatus(bool) {
    if (bool) {
      return 'INSTALLED';
    } else {
      return 'PENDING';
    }
  }
  setLoadOrderItemIndex(ind, ) {
    this.activeLoadOrderIndex = ind;
    this.cdr.detectChanges();
  }
  getLoadOrderPicture() {
    if (this.modList[0] !== undefined) {
      return this.modList[0].pictures[0];
    }
  }
  moveDownLoadOrder() {
    if (this.activeLoadOrderIndex !== this.loadOrder.length - 1) {
      this.store.dispatch(new ModManagerActions.ShiftDownModOfLoadOrder(this.loadOrder[this.activeLoadOrderIndex]));
      this.activeLoadOrderIndex += 1;
    }
  }
  moveUpLoadOrder() {
    if (this.activeLoadOrderIndex !== 0) {
      this.activeLoadOrderIndex -= 1;
      this.store.dispatch(new ModManagerActions.ShiftDownModOfLoadOrder(this.loadOrder[this.activeLoadOrderIndex]));
    }
  }
}
