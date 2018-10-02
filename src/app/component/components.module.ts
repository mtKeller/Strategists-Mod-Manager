import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModManagerComponent } from './mod-manager/mod-manager.component';
import { ModComponent } from './mod/mod.component';

@NgModule({
    declarations: [
        ModManagerComponent,
        ModComponent
    ],
    exports: [
        ModManagerComponent,
        ModComponent
    ]
})
export class ComponentsModule {}
