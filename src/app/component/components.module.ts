import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CtrlBarComponent } from './ctrl-bar/ctrl-bar.component';
import { ModManagerComponent } from './mod-manager/mod-manager.component';
import { ModListComponent } from './mod-list/mod-list.component';
import { ModComponent } from './mod/mod.component';
import { PopGalleryComponent } from './pop-gallery/pop-gallery.component';

@NgModule({
    declarations: [
        CtrlBarComponent,
        ModManagerComponent,
        ModListComponent,
        ModComponent,
        PopGalleryComponent
    ],
    exports: [
        CtrlBarComponent,
        ModManagerComponent,
        ModListComponent,
        ModComponent,
        PopGalleryComponent
    ]
})
export class ComponentsModule {}
