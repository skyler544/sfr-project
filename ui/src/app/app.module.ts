import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { EarthquakeFiltersComponent } from './components/earthquake-filters/earthquake-filters.component';
import { EarthquakeTableComponent } from './components/earthquake-table/earthquake-table.component';

@NgModule({
  declarations: [
    AppComponent,
    EarthquakeFiltersComponent,
    EarthquakeTableComponent,
  ],
  imports: [BrowserModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
