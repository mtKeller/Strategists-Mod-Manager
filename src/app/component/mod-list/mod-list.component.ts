import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectModList } from '../../store/ModManager/ModManager.selectors';

@Component({
  selector: 'app-mod-list',
  templateUrl: './mod-list.component.html',
  styleUrls: ['./mod-list.component.scss']
})
export class ModListComponent implements OnInit {
  modList: any = [];
  constructor(private store: Store<any>, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
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
    });
  }

}
