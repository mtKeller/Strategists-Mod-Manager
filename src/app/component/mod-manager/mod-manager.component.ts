import { Component, OnInit, Renderer2, ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';

import { ripple } from '../../helpers/funcLib';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectBlinkInstalled } from '../../store/ModManager/ModManager.selectors';

@Component({
  selector: 'app-mod-manager',
  templateUrl: './mod-manager.component.html',
  styleUrls: ['./mod-manager.component.scss']
})
export class ModManagerComponent implements OnInit, OnDestroy {
  currentManagerTab = 'MOD_LIST';
  loadOrderBlink = false;
  subs: Array<Subscription> = [];
  constructor(
    private store: Store<any>,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef) { }

  ngOnInit() {
    this.subs.push(
      this.store.pipe(
        select(selectBlinkInstalled)
      ).subscribe(val => {
        this.loadOrderBlink = val;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(val => {
      val.unsubscribe();
    });
  }

  setTab($event, id , target) {
    const elem = this.el.nativeElement.querySelector('#' + id);
    ripple($event, elem, id, this.renderer);
    this.currentManagerTab = target;
    this.cdr.detectChanges();
  }
}
