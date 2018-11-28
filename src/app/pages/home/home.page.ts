import { Component, Input, ChangeDetectorRef, OnInit, ViewChild, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ripple } from '../../helpers/funcLib';
import * as MainActions from '../../store/Main/Main.actions';
import * as MainSelectors from '../../store/Main/Main.selectors';
import * as ModManagerActions from '../../store/ModManager/ModManager.actions';
import * as ModManagerSelectors from '../../store/ModManager/ModManager.selectors';
import * as DownloadManagerSelectors from '../../store/DownloadManager/DownloadManager.selectors';
import { ActionTree, ActionTreeParams, ActionNode } from '../../model/ActionTree.class';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { replaceAll } from '../../helpers/funcLib';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  subs: Array<Subscription> = [];

  mhwDirectoryPath: any = null;
  mhwDirectoryMap: any = [];
  haltedAction: any = null;
  ready = false;

  downloadManagerItems: any = [];

  processingQue: any = [];
  installationQue: any = [];
  modProcessing: boolean;

  loadOrder: any = [];
  loadOrderBlink = false;

  downloading = false;

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
    this.subs.push(
      this.store.pipe(
        select(MainSelectors.selectReady)
      ).subscribe(val => {
        this.ready = val;
        this.cdr.detectChanges();
      }),
      this.store.pipe(
        select(MainSelectors.selectHaltedAction)
      ).subscribe(val => {
        this.haltedAction = val;
        this.cdr.detectChanges();
      }),
      this.store.pipe(
        select(MainSelectors.selectMhwDirectoryPath)
      ).subscribe(val => {
        this.mhwDirectoryPath = val;
        this.cdr.detectChanges();
      }),
      this.store.pipe(
        select(MainSelectors.selectMhwDirectoryMap)
      ).subscribe(val => {
        this.mhwDirectoryMap = val;
        this.cdr.detectChanges();
      }),
      this.store.pipe(
        select(DownloadManagerSelectors.selectCurrentFiles)
      ).subscribe(val => {
        this.downloadManagerItems = val;
        this.cdr.detectChanges();
      }),
      this.store.pipe(
        select(ModManagerSelectors.selectLoadOrder)
      ).subscribe(val => {
        this.loadOrder = val;
        this.cdr.detectChanges();
      }),
      this.store.pipe(
        select(ModManagerSelectors.selectInstallationQue)
      ).subscribe(val => {
        this.installationQue = val;
        this.cdr.detectChanges();
      }),
      this.store.pipe(
        select(ModManagerSelectors.selectProcessingQue)
      ).subscribe(val => {
        this.processingQue = val;
        this.cdr.detectChanges();
      }),
      this.store.pipe(
        select(ModManagerSelectors.selectModProcessing)
      ).subscribe(val => {
        this.modProcessing = val;
        this.cdr.detectChanges();
      })
    );
  }

  parseModChildTitle(str: string) {
    // console.log(str.replace(/[0-9]/g, ''));
    let newStr = str.replace(/[0-9]/g, '');
    newStr = replaceAll(newStr, '_', '');
    newStr = replaceAll(newStr, '-', '');
    newStr = newStr.replace('.zip', '');
    newStr = newStr.replace('.rar', '');
    newStr = newStr.replace('.7z', '');
    newStr = replaceAll(newStr, '.', '');
    return newStr;
  }

  ngOnDestroy(): void {
    this.subs.forEach(val => val.unsubscribe());
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
}
