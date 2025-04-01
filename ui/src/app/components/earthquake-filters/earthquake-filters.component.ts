import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'earthquake-filters',
  templateUrl: './earthquake-filters.component.html',
  styleUrls: ['./earthquake-filters.component.scss'],
})
export class EarthquakeFiltersComponent {
  @Input() minLatitude: number | null = null;
  @Input() maxLatitude: number | null = null;
  @Input() minLongitude: number | null = null;
  @Input() maxLongitude: number | null = null;
  @Input() minDepth: number | null = null;
  @Input() maxDepth: number | null = null;
  @Input() minEnergy: number | null = null;
  @Input() maxEnergy: number | null = null;
  @Input() selectedContinent: string = '';
  @Input() availableContinents: string[] = [];

  @Output() filterChange = new EventEmitter<{ property: string; value: any }>();
  @Output() resetFilters = new EventEmitter<void>();

  handleNumberInput(event: Event, property: string) {
    const value = (event.target as HTMLInputElement).value;

    if (value === '') {
      this.filterChange.emit({ property, value: null });
    } else {
      const numberValue = Number(value);
      if (!isNaN(numberValue)) {
        this.filterChange.emit({ property, value: numberValue });
      }
    }
  }

  handleContinentChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterChange.emit({ property: 'selectedContinent', value });
  }

  onResetFilters() {
    this.resetFilters.emit();
  }
}
