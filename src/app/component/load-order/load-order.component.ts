import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ShiftDownModOfLoadOrder, ShiftUpModOfLoadOrder, RemoveModFromLoadOrder } from '../../store/ModManager/ModManager.actions';
import { selectModList, selectLoadOrder } from '../../store/ModManager/ModManager.selectors';
import { Subscription } from 'rxjs';
import { Mod } from '../../store/ModManager/ModManager.state';
import { replaceAll } from '../../helpers/funcLib';


@Component({
  selector: 'app-load-order',
  templateUrl: './load-order.component.html',
  styleUrls: ['./load-order.component.scss'],
})
export class LoadOrderComponent implements OnInit, OnDestroy {
  subs: Array<Subscription> = [];
  modList: any = [];
  loadOrder: any = [];

  activeLoadOrderItem = null;
  activeLoadOrderIndex = 0;

  constructor(private store: Store<any>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subs.push(
      this.store.pipe(
        select(selectModList)
      ).subscribe((val => this.modList = val)),
      this.store.pipe(
        select(selectLoadOrder)
      ).subscribe(val => this.loadOrder = val)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(val => val.unsubscribe());
  }

  moveDownLoadOrder() {
    if (this.activeLoadOrderIndex !== this.loadOrder.length - 1 && this.loadOrder.length !== 0) {
      this.store.dispatch(new ShiftDownModOfLoadOrder(this.loadOrder[this.activeLoadOrderIndex]));
      this.activeLoadOrderIndex += 1;
    }
  }
  moveUpLoadOrder() {
    if (this.activeLoadOrderIndex !== 0 && this.loadOrder.length !== 0) {
      this.activeLoadOrderIndex -= 1;
      this.store.dispatch(new ShiftUpModOfLoadOrder(this.loadOrder[this.activeLoadOrderIndex]));
    }
  }
  removeFromLoadOrder() {
    if (this.loadOrder.length !== 0) {
      this.store.dispatch(new RemoveModFromLoadOrder(this.loadOrder[this.activeLoadOrderIndex]));
    }
    // console.log(this.loadOrder);
  }

  getStatus(bool) {
    if (bool) {
      return 'INSTALLED';
    } else {
      return 'PENDING';
    }
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

  setLoadOrderItemIndex(ind, ) {
    this.activeLoadOrderIndex = ind;
    this.cdr.detectChanges();
  }

  getLoadOrderPicture() {
    // if (this.modList[0] !== undefined) {
    //   return this.modList[0].pictures[0];
    // }
  }
}
