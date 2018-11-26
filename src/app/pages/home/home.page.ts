import { Component, Input, ChangeDetectorRef, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ripple } from '../../helpers/funcLib';
import * as MainActions from '../../store/Main/Main.actions';
import * as MainSelectors from '../../store/Main/Main.selectors';
import * as FileSystemActions from '../../store/FileSystem/FileSystem.actions';
import * as ModManagerActions from '../../store/ModManager/ModManager.actions';
import * as ModManagerSelectors from '../../store/ModManager/ModManager.selectors';
import * as DownloadManagerSelectors from '../../store/DownloadManager/DownloadManager.selectors';
import { ActionTree, ActionTreeParams, ActionNode } from '../../model/ActionTree.class';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mhwDirectoryPath: any = null;
  mhwDirectoryMap: any = [];
  haltedAction: any = null;
  ready = false;

  downloadManagerItems: any = [];

  processingQue: any = [];
  installationQue: any = [];
  modProcessing: boolean;

  modList: any = [];
  modListChildExpand: any = [];

  loadOrder: any = [];
  loadOrderBlink = false;

  downloading = false;

  activeLoadOrderItem = null;
  activeLoadOrderIndex = 0;

  ExplorerButton: HTMLElement;
  @ViewChild('explorerButton')
  set explorerButton(ele) {
    setTimeout(() => {
      this.ExplorerButton = ele.nativeElement;
    }, 500);
  }
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
    this.store.pipe(
      select(MainSelectors.selectReady)
    ).subscribe(val => {
      this.ready = val;
      this.cdr.detectChanges();
    });
    this.store.pipe(
      select(MainSelectors.selectHaltedAction)
    ).subscribe(val => {
      this.haltedAction = val;
      this.cdr.detectChanges();
    });
    this.store.pipe(
      select(MainSelectors.selectMhwDirectoryPath)
    ).subscribe(val => {
      this.mhwDirectoryPath = val;
      this.cdr.detectChanges();
    });
    this.store.pipe(
      select(MainSelectors.selectMhwDirectoryMap)
    ).subscribe(val => {
      this.mhwDirectoryMap = val;
      this.cdr.detectChanges();
    });
    this.store.pipe(
      select(DownloadManagerSelectors.selectCurrentFiles)
    ).subscribe(val => {
      this.downloadManagerItems = val;
      this.cdr.detectChanges();
    });
    this.store.pipe(
      select(ModManagerSelectors.selectModList)
    ).subscribe(val => {
      if (val) {
        console.log('CHECK MODLIST', val.keys());
        const newChildExpand = [];
        this.modList = val;
        for (let i = 0; i < val.length; i++) {
          newChildExpand.push(false);
        }
        this.modListChildExpand = newChildExpand;
        this.cdr.detectChanges();
      }
    });
    this.store.pipe(
      select(ModManagerSelectors.selectLoadOrder)
    ).subscribe(val => {
      this.loadOrder = val;
      this.cdr.detectChanges();
    });
    this.store.pipe(
      select(ModManagerSelectors.selectInstallationQue)
    ).subscribe(val => {
      this.installationQue = val;
      this.cdr.detectChanges();
    });
    this.store.pipe(
      select(ModManagerSelectors.selectProcessingQue)
    ).subscribe(val => {
      this.processingQue = val;
      this.cdr.detectChanges();
    });
    this.store.pipe(
      select(ModManagerSelectors.selectModProcessing)
    ).subscribe(val => {
      this.modProcessing = val;
      this.cdr.detectChanges();
    });
  }

  getMhwDirPath($event) {
    if (this.haltedAction !== null) {
      ripple($event, this.ExplorerButton, 'find-dir', this.renderer);
      this.store.dispatch(this.haltedAction.tree.success());
      console.log(this.haltedAction);
    }
  }
  play($event) {
    ripple($event, this.PlayButton, 'play-button', this.renderer);
    this.store.dispatch(new MainActions.Play());
  }
  openMhwDir($event) {
    if (this.mhwDirectoryPath !== null) {
      ripple($event, this.OpenDirButton, 'open-dir', this.renderer);
      this.store.dispatch(new MainActions.OpenMhwDirectory());
    }
  }
  openModNexus($event) {
    ripple($event, this.OpenNexusButton, 'open-nexus', this.renderer);
    this.store.dispatch(new MainActions.OpenModNexus);
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
  getEnabled(mod, childIndex) {
    return this.modList.entity[mod.index].enabled[childIndex];
  }
  moveDownLoadOrder() {
    if (this.activeLoadOrderIndex !== this.loadOrder.length - 1 && this.loadOrder.length !== 0) {
      this.store.dispatch(new ModManagerActions.ShiftDownModOfLoadOrder(this.loadOrder[this.activeLoadOrderIndex]));
      this.activeLoadOrderIndex += 1;
    }
  }
  moveUpLoadOrder() {
    if (this.activeLoadOrderIndex !== 0 && this.loadOrder.length !== 0) {
      this.activeLoadOrderIndex -= 1;
      this.store.dispatch(new ModManagerActions.ShiftDownModOfLoadOrder(this.loadOrder[this.activeLoadOrderIndex]));
    }
  }
  removeFromLoadOrder() {
    if (this.loadOrder.length !== 0) {
      this.store.dispatch(new ModManagerActions.RemoveModFromLoadOrder(this.loadOrder[this.activeLoadOrderIndex]));
    }
    // console.log(this.loadOrder);
  }
  uninstallMod($event, idStr, modIndex, indexOfChild) {
    const elem = this.el.nativeElement.querySelector('#' + idStr + modIndex + indexOfChild);
    // console.log(elem);
    // console.log(document.getElementById(idStr + modIndex + indexOfChild));
    this.ripple($event, elem, idStr + modIndex + indexOfChild);
    this.blinkLoadOrder();
    this.loadOrder.map(item => {
      if (item[0] === modIndex && item[1] === indexOfChild) {
        this.store.dispatch(new ModManagerActions.RemoveModFromLoadOrder([modIndex, indexOfChild]));
      }
    });
  }
  getIndexes(mod, childIndex): Array<any> {
    return [mod.index, childIndex];
  }
}
