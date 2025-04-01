import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { EarthquakeFiltersComponent } from './components/earthquake-filters/earthquake-filters.component';
import { EarthquakeTableComponent } from './components/earthquake-table/earthquake-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, EarthquakeFiltersComponent, EarthquakeTableComponent],
})
export class AppComponent implements OnInit {
  title = 'Seismic Data';
  devs = ['Skyler Mayfield', 'Alexander Plöchl'];

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
