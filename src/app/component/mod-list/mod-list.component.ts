import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectModList } from '../../store/ModManager/ModManager.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mod-list',
  templateUrl: './mod-list.component.html',
  styleUrls: ['./mod-list.component.scss']
})
export class ModListComponent implements OnInit, OnDestroy {
  modList: any = undefined;
  modEntities = [];
  private subs: Array<Subscription> = [];
  constructor(private store: Store<any>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('CHECK 1', this.modList);
    this.subs.push(
      this.store.pipe(
        select(selectModList)
      ).subscribe(val => {
        console.log('CHECK 2', this.modList);
        if (val) {
          // console.log('CHECK MODLIST', val.keys());
          const newChildExpand = [];
          this.modList = val;
          this.modEntities = this.modList.toArray();
          for (let i = 0; i < val.length; i++) {
            newChildExpand.push(false);
          }
          // this.modListChildExpand = newChildExpand;
          this.cdr.detectChanges();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getModListStatus() {
    if (this.modList === undefined) {
       return false;
    } else if (this.modList.length === 0) {
      return false;
    } else {
      return true;
    }
  }
}
