import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, combineLatest } from 'rxjs';
import { EarthquakeService } from '../../services/earthquake.service';
import { SortColumn, SortDirection } from '../../models/sort-criteria';
import { SensorData } from '@app/models/sensor-data';

@Component({
  selector: 'earthquake-table',
  templateUrl: './earthquake-table.component.html',
  styleUrls: ['./earthquake-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class EarthquakeTableComponent implements OnInit, OnDestroy {
  earthquakes: SensorData[] = [];
  paginatedData: SensorData[] = [];
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortColumn: SortColumn = 'id';
  sortDirection: SortDirection = 'asc';

  private subscription = new Subscription();

  constructor(
    private earthquakeService: EarthquakeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription.add(
      combineLatest([
        this.earthquakeService.earthquakes$,
        this.earthquakeService.filters$,
        this.earthquakeService.sorting$,
        this.earthquakeService.pagination$,
      ]).subscribe(([earthquakes, filters, sorting, pagination]) => {
        this.sortColumn = sorting.column;
        this.sortDirection = sorting.direction;
        this.currentPage = pagination.currentPage;
        this.pageSize = pagination.pageSize;

        this.earthquakes = this.earthquakeService.getFilteredData();
        this.paginatedData = this.earthquakeService.getPaginatedData();
        this.totalPages = this.earthquakeService.getTotalPages();

        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isSortingDefault(): boolean {
    return this.sortColumn === 'id' && this.sortDirection === 'asc';
  }

  onSortBy(column: string) {
    this.earthquakeService.updateSorting(column as SortColumn);
  }

  onResetSorting() {
    this.earthquakeService.resetSorting();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const totalVisible = 4;

    if (this.totalPages <= totalVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

      if (startPage <= 2) {
        endPage = Math.min(this.totalPages - 1, 4);
      }
      if (endPage >= this.totalPages - 1) {
        startPage = Math.max(2, this.totalPages - 3);
      }

      if (startPage > 2) {
        pages.push(-1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < this.totalPages - 1) {
        pages.push(-1);
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.earthquakeService.updatePagination(
        'currentPage',
        this.currentPage + 1
      );
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.earthquakeService.updatePagination(
        'currentPage',
        this.currentPage - 1
      );
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.earthquakeService.updatePagination('currentPage', page);
    }
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  parseFloat(value: string): number {
    return parseFloat(value);
  }

  trackByQuake(index: number, item: SensorData): string {
    return item.id;
  }
}
