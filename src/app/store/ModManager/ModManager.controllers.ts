import { ActionController$ } from '../../model/ActionController';
import { Store, select } from '@ngrx/store';
import * as ModManagerSelectors from './ModManager.selectors';
import { interval, Observable } from 'rxjs';

export function InitializeModQueController(store: Store<any>) {
    const ModQueController$: Observable<any> = ActionController$(
        store,
        ModManagerSelectors.selectModQueController,
        (obs) => {
            let processingQue;
            let installationQue;
            let modProcessing;
            store.pipe(
                select(ModManagerSelectors.selectProcessingQue)
            ).subscribe(val => {
                if (val) {
                    processingQue = val;
                }
            });
            store.pipe(
                select(ModManagerSelectors.selectInstallationQue)
            ).subscribe(val => {
                if (val) {
                    installationQue = val;
                }
            });
            store.pipe(
                select(ModManagerSelectors.selectModProcessing)
            ).subscribe(val => {
                if (val) {
                    modProcessing = val;
                }
            });
            interval(1000).subscribe(() => {
                if (!modProcessing && processingQue.length !== 0
                    ) {
                    obs.next(processingQue[0]);
                } else if (!modProcessing && processingQue.length === 0 &&
                    installationQue.length !== 0
                    ) {
                    obs.next(installationQue[0]);
                }
            });
        }
    );

    return ModQueController$.subscribe(val => {
        store.dispatch(val.action.tree.success());
    });
}

