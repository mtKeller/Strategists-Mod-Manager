import { Component, OnInit, Renderer2, ChangeDetectorRef, ElementRef } from '@angular/core';

import { ripple } from '../../helpers/funcLib';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-mod-manager',
  templateUrl: './mod-manager.component.html',
  styleUrls: ['./mod-manager.component.scss']
})
export class ModManagerComponent implements OnInit {
  currentManagerTab = 'MOD_LIST';
  loadOrderBlink = false;
  constructor(
    private store: Store<any>,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef) { }

  ngOnInit() {
  }
  setTab($event, id , target) {
    const elem = this.el.nativeElement.querySelector('#' + id);
    ripple($event, elem, id, this.renderer);
    this.currentManagerTab = target;
    this.cdr.detectChanges();
  }
  blinkLoadOrder() {
    this.loadOrderBlink = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.loadOrderBlink = false;
      this.cdr.detectChanges();
    }, 50);
  }
}
