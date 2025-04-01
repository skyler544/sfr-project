import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'earthquake-table',
  templateUrl: './earthquake-table.component.html',
  styleUrls: ['./earthquake-table.component.scss'],
})
export class EarthquakeTableComponent {
  @Input() earthquakes: any[] = [];
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() sortColumn: string = 'id';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Output() sort = new EventEmitter<{ column: string }>();
  @Output() resetSort = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.earthquakes.length / this.pageSize);
  }

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.earthquakes.slice(startIndex, startIndex + this.pageSize);
  }

  isSortingDefault(): boolean {
    return this.sortColumn === 'id' && this.sortDirection === 'asc';
  }

  onSortBy(column: string) {
    this.sort.emit({ column });
  }

  onResetSorting() {
    this.resetSort.emit();
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
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }
}
