import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Seismic Data';
  devs = ['Skyler Mayfield', 'Alexander Plöchl'];

  earthquakeDummyData = [
    {
      id: 1,
      continent: 'Africa',
      latitude: 10,
      longitude: 20,
      depth: 1,
      energy: 42,
    },
    {
      id: 2,
      continent: 'Africa',
      latitude: 15,
      longitude: 28,
      depth: 0.45,
      energy: 100000,
    },
    {
      id: 3,
      continent: 'Asia',
      latitude: -5.3,
      longitude: 120.8,
      depth: 3.2,
      energy: 15700,
    },
    {
      id: 4,
      continent: 'North America',
      latitude: 37.7,
      longitude: -122.4,
      depth: 5.1,
      energy: 31000,
    },
    {
      id: 5,
      continent: 'Europe',
      latitude: 51.5,
      longitude: -0.12,
      depth: 0.8,
      energy: 2100,
    },
    {
      id: 6,
      continent: 'Oceania',
      latitude: -33.9,
      longitude: 151.2,
      depth: 2.4,
      energy: 82500,
    },
    {
      id: 7,
      continent: 'Asia',
      latitude: 35.6,
      longitude: 139.7,
      depth: 17.6,
      energy: 247000,
    },
    {
      id: 8,
      continent: 'North America',
      latitude: 19.4,
      longitude: -99.1,
      depth: 8.2,
      energy: 56300,
    },
    {
      id: 9,
      continent: 'Europe',
      latitude: 48.8,
      longitude: 2.3,
      depth: 0.3,
      energy: 1800,
    },
    {
      id: 10,
      continent: 'South America',
      latitude: -12.0,
      longitude: -77.0,
      depth: 6.7,
      energy: 73200,
    },
    {
      id: 11,
      continent: 'Antarctica',
      latitude: -77.85,
      longitude: 167.17,
      depth: 4.2,
      energy: 12400,
    },
  ];
  minLatitude: number | null = null;
  maxLatitude: number | null = null;
  minLongitude: number | null = null;
  maxLongitude: number | null = null;
  minDepth: number | null = null;
  maxDepth: number | null = null;
  minEnergy: number | null = null;
  maxEnergy: number | null = null;
  selectedContinent: string = '';
  sortColumn:
    | 'id'
    | 'continent'
    | 'latitude'
    | 'longitude'
    | 'depth'
    | 'energy' = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  get availableContinents(): string[] {
    const continents = new Set<string>();
    this.earthquakeDummyData.forEach((quake) => {
      continents.add(quake.continent);
    });
    return Array.from(continents).sort();
  }

  get filteredData() {
    return this.earthquakeDummyData
      .filter((quake) => {
        if (
          this.selectedContinent &&
          quake.continent !== this.selectedContinent
        ) {
          return false;
        }

        if (this.minLatitude !== null && quake.latitude < this.minLatitude) {
          return false;
        }
        if (this.maxLatitude !== null && quake.latitude > this.maxLatitude) {
          return false;
        }

        if (this.minLongitude !== null && quake.longitude < this.minLongitude) {
          return false;
        }
        if (this.maxLongitude !== null && quake.longitude > this.maxLongitude) {
          return false;
        }

        const safeMinDepth =
          this.minDepth !== null && this.minDepth >= 0 ? this.minDepth : null;
        const safeMaxDepth =
          this.maxDepth !== null && this.maxDepth >= 0 ? this.maxDepth : null;

        if (safeMinDepth !== null && quake.depth < safeMinDepth) {
          return false;
        }
        if (safeMaxDepth !== null && quake.depth > safeMaxDepth) {
          return false;
        }

        const safeMinEnergy =
          this.minEnergy !== null && this.minEnergy >= 0
            ? this.minEnergy
            : null;
        if (safeMinEnergy !== null && quake.energy < safeMinEnergy) {
          return false;
        }

        const safeMaxEnergy =
          this.maxEnergy !== null && this.maxEnergy >= 0
            ? this.maxEnergy
            : null;
        if (safeMaxEnergy !== null && quake.energy > safeMaxEnergy) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const direction = this.sortDirection === 'asc' ? 1 : -1;

        if (a[this.sortColumn] < b[this.sortColumn]) {
          return -1 * direction;
        }
        if (a[this.sortColumn] > b[this.sortColumn]) {
          return 1 * direction;
        }
        return 0;
      });
  }

  onFilterChange(event: { property: string; value: any }) {
    const { property, value } = event;
    (this as any)[property] = value;
    this.currentPage = 1;
  }

  resetFilters() {
    this.minDepth = null;
    this.maxDepth = null;
    this.minEnergy = null;
    this.maxEnergy = null;
    this.selectedContinent = '';
    this.minLatitude = null;
    this.maxLatitude = null;
    this.minLongitude = null;
    this.maxLongitude = null;
    this.currentPage = 1;
  }

  onSort(event: { column: string }) {
    const column = event.column as
      | 'id'
      | 'continent'
      | 'latitude'
      | 'longitude'
      | 'depth'
      | 'energy';
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  resetSorting() {
    this.sortColumn = 'id';
    this.sortDirection = 'asc';
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
