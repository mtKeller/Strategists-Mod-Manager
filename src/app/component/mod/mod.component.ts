import { Component, OnInit, Input, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { Mod } from '../../store/ModManager/ModManager.state';
import { Store, select } from '@ngrx/store';
import { ripple, replaceAll } from '../../helpers/funcLib';
import { InsertToFrontOfLoadOrder, RemoveModFromLoadOrder } from '../../store/ModManager/ModManager.actions';
import { selectLoadOrder } from '../../store/ModManager/ModManager.selectors';

interface ModEntity {
  index: number;
  data: Mod;
}

@Component({
  selector: 'app-mod',
  templateUrl: './mod.component.html',
  styleUrls: ['./mod.component.scss']
})
export class ModComponent {
  mod: Mod;
  modPos: number;
  childrenExpanded: boolean;
  @Input() set modEntity(modEnt: ModEntity) {
    this.mod = modEnt.data;
    this.modPos = modEnt.index;
  }

  constructor(
    private store: Store<any>,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef
    ) {
    this.childrenExpanded = false;
  }

  toggleChildExpand($event, index, idStr) {
    console.log('EXPAND!');
    const elem = this.el.nativeElement.querySelector('#' + idStr + index);
    ripple($event, elem, idStr + index, this.renderer);
    if (index !== null) {
      this.childrenExpanded = !this.childrenExpanded;
    }
  }

  getExpandToggle(index) {
    // console.log(index, this.modListChildExpand[index]);
    if (index !== null || index !== undefined) {
      return this.childrenExpanded;
    }
    return false;
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

  addToLoadOrder($event, childIndex, idStr) {
    const elem = this.el.nativeElement.querySelector('#' + idStr + this.modPos + childIndex);
    console.log(elem);
    console.log(document.getElementById(idStr + this.modPos + childIndex));
    ripple($event, elem, idStr + this.modPos + childIndex, this.renderer);
    // this.blinkLoadOrder();
    this.store.dispatch(new InsertToFrontOfLoadOrder([this.modPos, childIndex]));
  }
  uninstallMod($event, childIndex, idStr) {
    const elem = this.el.nativeElement.querySelector('#' + idStr + this.modPos + childIndex);
    // console.log(elem);
    // console.log(document.getElementById(idStr + modIndex + indexOfChild));
    ripple($event, elem, idStr + this.modPos + childIndex, this.renderer);
    // this.blinkLoadOrder();
    const sub = this.store.pipe(
      select(selectLoadOrder)
    ).subscribe(val => {
      val.map(item => {
        if (item[0] === this.modPos && item[1] === childIndex) {
          this.store.dispatch(new RemoveModFromLoadOrder([this.modPos, childIndex]));
        }
      });
      sub.unsubscribe();
    });
  }

  getEnabled(childIndex) {
    return this.mod.enabled[childIndex];
  }
}
