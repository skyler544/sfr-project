import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Earthquake } from '../models/earthquake';
import { SortColumn, SortDirection } from '../models/sort-criteria';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeService {
  private earthquakeDummyData: Earthquake[] = [
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

  private filterState = new BehaviorSubject<{
    minLatitude: number | null;
    maxLatitude: number | null;
    minLongitude: number | null;
    maxLongitude: number | null;
    minDepth: number | null;
    maxDepth: number | null;
    minEnergy: number | null;
    maxEnergy: number | null;
    selectedContinent: string;
  }>({
    minLatitude: null,
    maxLatitude: null,
    minLongitude: null,
    maxLongitude: null,
    minDepth: null,
    maxDepth: null,
    minEnergy: null,
    maxEnergy: null,
    selectedContinent: '',
  });

  private sortState = new BehaviorSubject<{
    column: SortColumn;
    direction: SortDirection;
  }>({
    column: 'id',
    direction: 'asc',
  });

  private paginationState = new BehaviorSubject<{
    currentPage: number;
    pageSize: number;
  }>({
    currentPage: 1,
    pageSize: 10,
  });

  filters$ = this.filterState.asObservable();
  sorting$ = this.sortState.asObservable();
  pagination$ = this.paginationState.asObservable();

  getFilters() {
    return this.filterState.value;
  }

  getSorting() {
    return this.sortState.value;
  }

  getPagination() {
    return this.paginationState.value;
  }

  updateFilter(property: string, value: any) {
    this.filterState.next({
      ...this.filterState.value,
      [property]: value,
    });

    this.updatePagination('currentPage', 1);
  }

  resetFilters() {
    this.filterState.next({
      minLatitude: null,
      maxLatitude: null,
      minLongitude: null,
      maxLongitude: null,
      minDepth: null,
      maxDepth: null,
      minEnergy: null,
      maxEnergy: null,
      selectedContinent: '',
    });

    this.updatePagination('currentPage', 1);
  }

  updateSorting(column: SortColumn) {
    const currentSorting = this.sortState.value;

    if (currentSorting.column === column) {
      this.sortState.next({
        column,
        direction: currentSorting.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      this.sortState.next({
        column,
        direction: 'asc',
      });
    }
  }

  resetSorting() {
    this.sortState.next({
      column: 'id',
      direction: 'asc',
    });
  }

  updatePagination(property: string, value: any) {
    this.paginationState.next({
      ...this.paginationState.value,
      [property]: value,
    });
  }

  getAvailableContinents(): string[] {
    const continents = new Set<string>();
    this.earthquakeDummyData.forEach((quake) => {
      continents.add(quake.continent);
    });
    return Array.from(continents).sort();
  }

  getFilteredData(): Earthquake[] {
    const filters = this.filterState.value;
    const sorting = this.sortState.value;

    return this.earthquakeDummyData
      .filter((quake) => {
        if (
          filters.selectedContinent &&
          quake.continent !== filters.selectedContinent
        ) {
          return false;
        }

        if (
          filters.minLatitude !== null &&
          quake.latitude < filters.minLatitude
        ) {
          return false;
        }
        if (
          filters.maxLatitude !== null &&
          quake.latitude > filters.maxLatitude
        ) {
          return false;
        }

        if (
          filters.minLongitude !== null &&
          quake.longitude < filters.minLongitude
        ) {
          return false;
        }
        if (
          filters.maxLongitude !== null &&
          quake.longitude > filters.maxLongitude
        ) {
          return false;
        }

        const safeMinDepth =
          filters.minDepth !== null && filters.minDepth >= 0
            ? filters.minDepth
            : null;
        if (safeMinDepth !== null && quake.depth < safeMinDepth) {
          return false;
        }

        const safeMaxDepth =
          filters.maxDepth !== null && filters.maxDepth >= 0
            ? filters.maxDepth
            : null;
        if (safeMaxDepth !== null && quake.depth > safeMaxDepth) {
          return false;
        }

        const safeMinEnergy =
          filters.minEnergy !== null && filters.minEnergy >= 0
            ? filters.minEnergy
            : null;
        if (safeMinEnergy !== null && quake.energy < safeMinEnergy) {
          return false;
        }

        const safeMaxEnergy =
          filters.maxEnergy !== null && filters.maxEnergy >= 0
            ? filters.maxEnergy
            : null;
        if (safeMaxEnergy !== null && quake.energy > safeMaxEnergy) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const direction = sorting.direction === 'asc' ? 1 : -1;

        if (a[sorting.column] < b[sorting.column]) {
          return -1 * direction;
        }
        if (a[sorting.column] > b[sorting.column]) {
          return 1 * direction;
        }
        return 0;
      });
  }

  getPaginatedData(): Earthquake[] {
    const { currentPage, pageSize } = this.paginationState.value;
    const filteredData = this.getFilteredData();

    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }

  getTotalPages(): number {
    return Math.ceil(
      this.getFilteredData().length / this.paginationState.value.pageSize
    );
  }
}
