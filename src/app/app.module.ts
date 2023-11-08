import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { MaterialExampleModule } from 'material.module'
import { Funcoes } from './servicos/funcoes.service'
import { ExchangeService } from './servicos/exchanges.service'


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialExampleModule
  ],
  providers: [ExchangeService, Funcoes],
  bootstrap: [AppComponent]
})
export class AppModule { }
