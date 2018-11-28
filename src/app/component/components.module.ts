import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CtrlBarComponent } from './ctrl-bar/ctrl-bar.component';
import { ModManagerComponent } from './mod-manager/mod-manager.component';
import { ModListComponent } from './mod-list/mod-list.component';
import { ModComponent } from './mod/mod.component';
import { PopGalleryComponent } from './pop-gallery/pop-gallery.component';
import { LoadOrderComponent } from './load-order/load-order.component';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        IonicModule.forRoot(),
        CommonModule,
    ],
    declarations: [
        CtrlBarComponent,
        ModManagerComponent,
        ModListComponent,
        ModComponent,
        PopGalleryComponent,
        LoadOrderComponent
    ],
    exports: [
        CtrlBarComponent,
        ModManagerComponent,
        ModListComponent,
        ModComponent,
        PopGalleryComponent,
        LoadOrderComponent
    ]
})
export class ComponentsModule {}
