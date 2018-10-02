import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModManagerComponent } from './mod-manager.component';
import { ComponentsModule } from '../../component/components.module';

@NgModule({
  imports: [
    ComponentsModule,
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [ModManagerComponent],
  bootstrap: [ ModManagerComponent ]
})
export class HomePageModule {}
