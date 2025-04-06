import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { SensorData } from '../models/sensor-data';
import { SortColumn, SortDirection } from '../models/sort-criteria';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeService {
  private apiUrl = 'http://localhost:8080/Seismic';
  private earthquakeData = new BehaviorSubject<SensorData[]>([]);

  earthquakes$ = this.earthquakeData.asObservable();

  constructor(private http: HttpClient) {
    this.loadEarthquakes();
  }

  private filterState = new BehaviorSubject<{
    minLatitude: number | null;
    maxLatitude: number | null;
    minLongitude: number | null;
    maxLongitude: number | null;
    minDepth: number | null;
    maxDepth: number | null;
    minEnergy: number | null;
    maxEnergy: number | null;
  }>({
    minLatitude: null,
    maxLatitude: null,
    minLongitude: null,
    maxLongitude: null,
    minDepth: null,
    maxDepth: null,
    minEnergy: null,
    maxEnergy: null,
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

  getFilteredData(): SensorData[] {
    const filters = this.filterState.value;
    const sorting = this.sortState.value;

    return this.earthquakeData.value
      .filter((quake: SensorData) => {
        const lat = this.parseLatitude(quake.latitude);
        const lng = this.parseLongitude(quake.longitude);

        if (filters.minLatitude !== null && lat < filters.minLatitude) {
          return false;
        }
        if (filters.maxLatitude !== null && lat > filters.maxLatitude) {
          return false;
        }

        if (filters.minLongitude !== null && lng < filters.minLongitude) {
          return false;
        }
        if (filters.maxLongitude !== null && lng > filters.maxLongitude) {
          return false;
        }

        if (filters.minDepth !== null && quake.depth < filters.minDepth) {
          return false;
        }
        if (filters.maxDepth !== null && quake.depth > filters.maxDepth) {
          return false;
        }

        if (filters.minEnergy !== null && quake.energy < filters.minEnergy) {
          return false;
        }
        if (filters.maxEnergy !== null && quake.energy > filters.maxEnergy) {
          return false;
        }

        return true;
      })
      .sort((a: SensorData, b: SensorData) => {
        const direction = sorting.direction === 'asc' ? 1 : -1;

        switch (sorting.column) {
          case 'id':
            return a.id.localeCompare(b.id) * direction;
          case 'sensor':
            return a.sensor.id.localeCompare(b.sensor.id) * direction;
          case 'latitude':
            return (
              (this.parseLatitude(a.latitude) -
                this.parseLatitude(b.latitude)) *
              direction
            );
          case 'longitude':
            return (
              (this.parseLongitude(a.longitude) -
                this.parseLongitude(b.longitude)) *
              direction
            );
          case 'depth':
            return (a.depth - b.depth) * direction;
          case 'energy':
            return (a.energy - b.energy) * direction;
          default:
            return 0;
        }
      });
  }

  getPaginatedData(): SensorData[] {
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

  loadEarthquakes(): void {
    this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching earthquake data:', error);
          return throwError(
            () =>
              new Error(
                'Failed to load earthquake data. Please try again later.'
              )
          );
        })
      )
      .subscribe((data) => {
        const transformedData: SensorData[] = data.map((sensorData) => ({
          id: sensorData.id,
          sensor: sensorData.sensor,
          latitude: sensorData.latitude,
          longitude: sensorData.longitude,
          depth: sensorData.depth,
          energy: sensorData.energy,
        }));

        this.earthquakeData.next(transformedData);
      });
  }

  private parseLatitude(latString: string): number {
    if (!latString) return 0;
    const value = parseFloat(latString);
    return latString.endsWith('S') ? -value : value;
  }

  private parseLongitude(lngString: string): number {
    if (!lngString) return 0;
    const value = parseFloat(lngString);
    return lngString.endsWith('W') ? -value : value;
  }

  private parseCoordinate(coordString: string): {
    value: number;
    direction: 'N' | 'S' | 'E' | 'W';
  } {
    if (!coordString) return { value: 0, direction: 'N' };

    const direction = coordString.slice(-1) as 'N' | 'S' | 'E' | 'W';
    const value = parseFloat(coordString);

    return { value, direction };
  }
}
