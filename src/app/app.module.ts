import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportePeliculasComponent } from './reporte-peliculas/reporte-peliculas.component';

@NgModule({
  declarations: [
    AppComponent,
    ReportePeliculasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule // Agrega FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }