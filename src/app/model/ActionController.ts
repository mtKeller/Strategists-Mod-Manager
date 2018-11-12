import { Store, select, MemoizedSelector } from '@ngrx/store';
import { Observable } from 'rxjs';

export function ActionController$(store: Store<any>, selector: MemoizedSelector<any, any>, controlFunc: Function) {
    return Observable.create((obs) => {
        let enabled = false;
        store.pipe(select(selector)).subscribe(val => enabled = val);
        controlFunc(obs);
    });
}
