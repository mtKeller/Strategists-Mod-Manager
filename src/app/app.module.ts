import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FileSystemReducer } from './store/FileSystem/FileSystem.reducer';
import { FileSystemEffects } from './store/FileSystem/FileSystem.effects';

import { MainReducer } from './store/Main/Main.reducer';
import { MainEffects } from './store/Main/Main.effects';

import { ActionChain } from '../app/model/ActionChain.class';
declare module '@ngrx/store' {
  interface Action {
    type: string;
    chain?: ActionChain;
  }
}


declare global {
  interface Window { require: any; }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot({
      FileSystemState: FileSystemReducer,
      MainState: MainReducer
    }),
    EffectsModule.forRoot([
      FileSystemEffects,
      MainEffects
    ])
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
