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
  modList: any = [];
  private subs: Array<Subscription>;
  constructor(private store: Store<any>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subs.push(
      this.store.pipe(
        select(selectModList)
      ).subscribe(val => {
        if (val) {
          // console.log('CHECK MODLIST', val.keys());
          const newChildExpand = [];
          this.modList = val;
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

}
